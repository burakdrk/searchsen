import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { GenericResponseBody, JustlogResponse, Logs } from "~types";
import { parseTwitchEmotes, strDifference } from "~utils/background";

export type GetLogsFromJustlogRequest = {
  channelName: string;
  from: number;
  to: number;
  baseURL: string;
};

const handler: PlasmoMessaging.MessageHandler<
  GetLogsFromJustlogRequest,
  GenericResponseBody<Logs[]>
> = async (req, res) => {
  if (!req.body) {
    res.send({ error: "Missing request body" });
    return;
  }

  const { baseURL, channelName, from, to } = req.body;

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

    res.send({
      data: data.messages.map((msg) => {
        const d = new Date(msg.timestamp);
        const f = d.getTime();
        const secs = Math.floor((f - from) / 1000);

        return {
          secs,
          intoVod: strDifference(secs),
          user: msg.displayName,
          message: msg.text,
          color: msg.tags.color || "#808080",
          emotes: parseTwitchEmotes(msg.tags.emotes)
        };
      })
    });
  } catch (error) {
    console.error(error);
    res.send({ error: "Error fetching logs" });
  }
};

export default handler;
