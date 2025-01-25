import { useEffect, useState } from "react";
import {
  getAPILinks,
  getChunks,
  getLogsFromJustlog,
  getLogsFromTwitch,
  getTwitchTokens,
  getVODInfo
} from "~utils/content";
import { SAVED_API_LINKS } from "~utils/shared/constants";
import type { Emote, Logs, TwitchTokens } from "~types";
import type { GetVODInfoResponse } from "~background/messages/getVODInfo";
import { useAppDispatch, useAppSelector } from "./redux";
import { setCurrentPage, setSearchValue } from "~store/appSlice";
import { setEmotes, setIsLoading, setLength, setLogs } from "~store/logSlice";
import { Storage } from "@plasmohq/storage";

export default function useGetLogs() {
  const isLoading = useAppSelector((state) => state.log.isLoading);
  const fetchedFor = useAppSelector((state) => state.log.fetchedFor);

  const [loadingMessage, setLoadingMessage] = useState("Loading");
  const [error, setError] = useState<string | null>(null);

  const disptach = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();

    const tabChangeListener = (message: { message: string }) => {
      if (message.message === "searchsen_tabUpdated") {
        controller.abort();
      }
    };

    chrome.runtime.onMessage.addListener(tabChangeListener);

    const fetchData = async () => {
      try {
        const tokens = getTwitchTokens();
        if (!tokens.video_id) {
          throw new Error("Go to a VOD page");
        }
        if (!tokens.client_id || !tokens.unique_id) {
          throw new Error("Login to Twitch");
        }

        if (fetchedFor === tokens.video_id) return;

        disptach(setSearchValue(""));
        disptach(setCurrentPage("search"));
        disptach(setIsLoading(true));

        const vodInfo = await fetchVODData(tokens as TwitchTokens);

        setLoadingMessage("Fetching logs...");
        const apiLinks = await fetchAPILinks(vodInfo.channelname);

        const data = await fetchAndProcessLogs(
          apiLinks,
          vodInfo,
          tokens as TwitchTokens,
          setLoadingMessage,
          controller.signal
        );

        if (controller.signal.aborted) {
          throw new Error("Download cancelled.");
        }

        disptach(setLogs({ logs: data.logs, fetchedFor: tokens.video_id }));
        disptach(setEmotes(data.emotes));
        disptach(setLength(vodInfo.length));
      } catch (err) {
        err instanceof Error
          ? setError(err.message)
          : setError("An unknown error occurred");
      } finally {
        disptach(setIsLoading(false));
      }
    };

    fetchData();

    return () => {
      controller.abort();
      chrome.runtime.onMessage.removeListener(tabChangeListener);
    };
  }, [disptach, fetchedFor]);

  return { isLoading, loadingMessage, error };
}

async function fetchVODData(tokens: TwitchTokens) {
  const vodInfo = await getVODInfo(tokens);
  if (!vodInfo.data) {
    throw new Error("Error fetching VOD info");
  }
  return vodInfo.data;
}

async function fetchAPILinks(channelName: string) {
  const apiLinks = await getAPILinks(channelName);
  if (!apiLinks.data) {
    apiLinks.data = SAVED_API_LINKS;
  }

  return apiLinks.data;
}

async function fetchAndProcessLogs(
  apiLinks: string[],
  vodInfo: GetVODInfoResponse,
  tokens: TwitchTokens,
  setLoadingMessage: (message: string) => void,
  signal: AbortSignal
) {
  const start = new Date(vodInfo.created_at).getTime();
  const end = start + vodInfo.length * 1000;

  const storage = new Storage({
    area: "local"
  });

  let twitchFallback: boolean | undefined = await storage.get("twitchFallback");
  if (twitchFallback === undefined) {
    twitchFallback = true;
    await storage.set("twitchFallback", twitchFallback);
  }

  for (const link of apiLinks) {
    if (signal.aborted) {
      throw new Error("Download cancelled.");
    }

    const logs = await getLogsFromJustlog({
      baseURL: link,
      channelName: vodInfo.channelname,
      from: start,
      to: end,
      channelID: vodInfo.channelid
    });

    if (logs.data) {
      let ret = logs.data.data;
      let done = logs.data.done;

      while (done === false) {
        const temp = await getChunks(logs.data.chunkID);
        if (!temp.data) {
          throw new Error("Error fetching logs");
        }

        ret += temp.data.data;
        done = temp.data.done;
      }

      const parsed: {
        logs: Logs[];
        emotes: Record<string, Emote>;
      } = JSON.parse(ret);

      return parsed;
    }
  }

  if (!twitchFallback) {
    throw new Error(
      "No logs found. Try enabling Twitch API fallback in settings."
    );
  }

  // If we reach here, we couldn't fetch logs, try Twitch GQL API
  return await fetchFromTwitch(
    tokens,
    setLoadingMessage,
    vodInfo.length,
    signal,
    vodInfo.channelid
  );
}

async function fetchFromTwitch(
  tokens: TwitchTokens,
  setLoadingMessage: (message: string) => void,
  length: number,
  signal: AbortSignal,
  channelID: string
) {
  let offset: number | null = 0;
  let cursor: string | null = null;

  const result: {
    logs: Logs[];
    emotes: Record<string, Emote>;
  } = {
    logs: [],
    emotes: {}
  };

  let hasMoreLogs = true;
  while (hasMoreLogs) {
    if (signal.aborted) {
      throw new Error("Download cancelled.");
    }

    const res = await getLogsFromTwitch({ tokens, offset, cursor, channelID });
    if (!res.data) {
      throw new Error("Error fetching logs");
    }

    result.logs = result.logs.concat(res.data.logs);
    if (res.data.emotes) {
      result.emotes = res.data.emotes;
    }
    offset = null;
    cursor = null;

    const last = result.logs.at(-1);

    last &&
      setLoadingMessage(
        "Fetching logs... " + Math.round((last.s * 100) / length) + "%"
      );

    if (res.data.hasNextPage) {
      cursor = res.data.lastCursor;
    } else {
      hasMoreLogs = false;
    }
  }

  return result;
}
