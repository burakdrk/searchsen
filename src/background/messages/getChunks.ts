import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { GenericResponseBody } from "~types";

export type GetChunksResponse = {
  data: string;
  done: boolean;
};

const handler: PlasmoMessaging.MessageHandler<
  string,
  GenericResponseBody<GetChunksResponse>
> = async (req, res) => {
  const chunkID = req.body;
  if (!chunkID) {
    res.send({ error: "Missing chunk ID" });
    return;
  }

  try {
    if (
      self.chunksMap[chunkID].data.length === 0 ||
      self.chunksMap[chunkID].index === self.chunksMap[chunkID].data.length
    ) {
      throw new Error("No logs to send");
    }

    self.chunksMap[chunkID].index++;

    const done =
      self.chunksMap[chunkID].index === self.chunksMap[chunkID].data.length - 1;

    res.send({
      data: {
        data: self.chunksMap[chunkID].data[self.chunksMap[chunkID].index],
        done
      }
    });

    // Clear chunks if we're done
    if (done) {
      console.log("Clearing chunks");
      delete self.chunksMap[chunkID];
    }
  } catch (error) {
    console.log(error);
    res.send({ error: "Error getting logs" });
  }
};

export default handler;
