import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { GenericResponseBody } from "~types";

const handler: PlasmoMessaging.MessageHandler<
  string,
  GenericResponseBody<string[]>
> = async (req, res) => {
  if (!req.body) {
    res.send({ error: "Missing request body" });
    return;
  }
  try {
    const apiRes = await fetch(`https://logs.zonian.dev/api/${req.body}`, {
      method: "GET"
    });

    if (!apiRes.ok) {
      throw new Error();
    }

    const data = await apiRes.json();

    if (data.error || !data.available.channel) {
      throw new Error();
    }

    res.send({ data: data.channelLogs.instances });
  } catch (error) {
    console.error(error);
    res.send({ error: "Error reaching API" });
  }
};

export default handler;
