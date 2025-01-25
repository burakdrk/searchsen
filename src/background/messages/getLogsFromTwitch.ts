import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { Emote, GenericResponseBody, Logs, TwitchTokens } from "~types";
import { Storage } from "@plasmohq/storage";
import {
  BTTVService,
  FFZService,
  SevenTVService,
  ThirdPartyEmoteService
} from "~utils/background/emotes";

export type GetLogsFromTwitchRequest = {
  tokens: TwitchTokens;
  offset: number | null;
  cursor: string | null;
  channelID: string;
};

export type GetLogsFromTwitchResponse = {
  logs: Logs[];
  hasNextPage: boolean;
  lastCursor: string;
  emotes?: Record<string, Emote>;
};

const handler: PlasmoMessaging.MessageHandler<
  GetLogsFromTwitchRequest,
  GenericResponseBody<GetLogsFromTwitchResponse>
> = async (req, res) => {
  if (!req.body) {
    res.send({ error: "Missing request body" });
    return;
  }

  const { tokens, cursor, offset, channelID } = req.body;

  const tpService = new ThirdPartyEmoteService(channelID, [
    new FFZService(),
    new BTTVService(),
    new SevenTVService()
  ]);

  const storage = new Storage({
    area: "local"
  });

  let emotesOn: boolean | undefined = await storage.get("emotesOn");
  if (emotesOn === undefined) {
    emotesOn = true;
    await storage.set("emotesOn", emotesOn);
  }

  const storedIntegrity = await storage.get("integrity");
  if (!storedIntegrity) {
    res.send({ error: "Missing integrity" });
    return;
  }

  try {
    const apiRes = await fetch(`https://gql.twitch.tv/gql`, {
      method: "POST",
      headers: {
        Authorization: tokens.oauth,
        "Client-Id": tokens.client_id,
        "X-Device-Id": tokens.unique_id,
        "Client-Integrity": storedIntegrity
      },
      body: JSON.stringify([
        {
          operationName: "VideoCommentsByOffsetOrCursor",
          variables: {
            videoID: tokens.video_id,
            ...(offset !== null ? { contentOffsetSeconds: offset } : { cursor })
          },
          extensions: {
            persistedQuery: {
              version: 1,
              sha256Hash:
                "b70a3591ff0f4e0313d126c6a1502d79a1c02baebb288227c582044aa76adf6a"
            }
          }
        }
      ])
    });

    if (!apiRes.ok) {
      throw new Error();
    }

    const data = await apiRes.json();

    const logArr: Logs[] = [];

    // @ts-expect-error its too big
    data[0].data.video.comments.edges.forEach((e) => {
      if (e.node.commenter == null) return;
      if (e.node.message.fragments[0] == null) return;

      logArr.push({
        s: e.node.contentOffsetSeconds,
        u: e.node.commenter.login,
        m: e.node.message.fragments
          .map((f: Record<string, string>) => f.text)
          .join(""),
        c: e.node.message.userColor
      });
    });

    res.send({
      data: {
        logs: logArr,
        hasNextPage: data[0].data.video.comments.pageInfo.hasNextPage,
        lastCursor: data[0].data.video.comments.edges.at(-1).cursor,
        ...(offset === 0 &&
          emotesOn && {
            emotes: Object.fromEntries(
              new Map([...(await tpService.getEmotes())])
            )
          })
      }
    });
  } catch (error) {
    console.error(error);
    res.send({ error: "Error fetching logs" });
  }
};

export default handler;
