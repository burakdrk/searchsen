import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { GenericResponseBody } from "~types";

export type GetLogsFromJustlogRequest = {
  channelName: string;
  from: number;
  to: number;
  baseURL: string;
};

const handler: PlasmoMessaging.MessageHandler<
  GetLogsFromJustlogRequest,
  GenericResponseBody<unknown>
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

    const data = await apiRes.json();

    console.log(data);

    res.send({ data: "buh" });
  } catch (error) {
    console.error(error);
    res.send({ error: "Error fetching logs" });
  }
};

export default handler;
