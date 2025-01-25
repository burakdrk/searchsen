import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { GenericResponseBody } from "~types";

export type GetChunksResponse = {
  data: string;
  done: boolean;
};

const handler: PlasmoMessaging.MessageHandler<
  void,
  GenericResponseBody<GetChunksResponse>
> = async (_, res) => {
  try {
    if (
      self.chunks.data.length === 0 ||
      self.chunks.index === self.chunks.data.length
    ) {
      throw new Error("No logs to send");
    }

    self.chunks.index++;

    const done = self.chunks.index === self.chunks.data.length - 1;

    res.send({
      data: {
        data: self.chunks.data[self.chunks.index],
        done
      }
    });

    // Clear chunks if we're done
    if (done) {
      console.log("Clearing chunks");
      self.chunks = {
        data: [],
        index: 0
      };
    }
  } catch (error) {
    console.error(error);
    res.send({ error: "Error getting logs" });
  }
};

export default handler;
