import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { Emote, GenericResponseBody, JustlogResponse } from "~types";
import { parseTwitchEmotes } from "~utils/background";
import { Storage } from "@plasmohq/storage";
import {
  BTTVService,
  FFZService,
  SevenTVService,
  ThirdPartyEmoteService
} from "~utils/background/emotes";
import { MAX_CHUNK_SIZE } from "~utils/shared/constants";
import { v4 as uuidv4 } from "uuid";

export type GetLogsFromJustlogRequest = {
  channelName: string;
  from: number;
  to: number;
  baseURL: string;
  channelID: string;
};

export type GetLogsFromJustlogResponse = {
  data: string;
  done: boolean;
  chunkID: string;
};

const handler: PlasmoMessaging.MessageHandler<
  GetLogsFromJustlogRequest,
  GenericResponseBody<GetLogsFromJustlogResponse>
> = async (req, res) => {
  if (!req.body) {
    res.send({ error: "Missing request body" });
    return;
  }

  const { baseURL, channelName, from, to, channelID } = req.body;

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

  try {
    const apiRes = await fetch(
      `${baseURL}/channel/${channelName}?from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}&jsonBasic=true`,
      {
        method: "GET"
      }
    );

    if (!apiRes.ok) {
      throw new Error();
    }

    const data: JustlogResponse = await apiRes.json();

    // Map the name to the emote object
    let allEmotes: Record<string, Emote> = {};
    if (emotesOn) {
      const twitchEmotes = new Map<string, Emote>();
      const tpEmotes = await tpService.getEmotes();

      const urlSet = new Set<string>();

      // Parse Twitch emotes
      data.messages.forEach((msg) => {
        const parsedEmotes = parseTwitchEmotes(msg.tags.emotes);

        parsedEmotes.forEach((e) => {
          const emoteName = Array.from(msg.text)
            .slice(e.start, e.end + 1)
            .join("");

          const url = `https://static-cdn.jtvnw.net/emoticons/v1/${e.id}/1.0`;

          // Skip if we've already added this url
          if (urlSet.has(url)) return;

          twitchEmotes.set(emoteName, {
            url,
            name: emoteName,
            type: "twitch"
          });

          urlSet.add(url);
        });
      });

      // Merge all emotes, prefer third-party emotes over Twitch emotes
      allEmotes = Object.fromEntries(new Map([...twitchEmotes, ...tpEmotes]));
    }

    const ret = data.messages.map((msg) => {
      const d = new Date(msg.timestamp);
      const f = d.getTime();
      const secs = Math.floor((f - from) / 1000);

      return {
        s: secs,
        u: msg.displayName,
        m: msg.text,
        c: msg.tags.color || "#808080"
      };
    });

    const serializedData = JSON.stringify({
      logs: ret,
      emotes: allEmotes
    });

    const chunkID = uuidv4();

    self.chunksMap[chunkID] = {
      data: [],
      index: 0
    };

    const len = serializedData.length;
    const step = MAX_CHUNK_SIZE;
    let ii = 0;
    while (ii < len) {
      const nextIndex = Math.min(ii + step, len);
      const substr = serializedData.substring(ii, nextIndex);
      self.chunksMap[chunkID].data.push(substr);
      ii = nextIndex;
    }

    const done =
      self.chunksMap[chunkID].index === self.chunksMap[chunkID].data.length - 1;

    res.send({
      data: {
        data: self.chunksMap[chunkID].data[self.chunksMap[chunkID].index],
        done,
        chunkID
      }
    });

    // Clear chunks if we're done
    if (done) {
      console.log("Clearing chunks");
      delete self.chunksMap[chunkID];
    }
  } catch (error) {
    console.log(error);
    res.send({ error: "Error fetching logs" });
  }
};

export default handler;
