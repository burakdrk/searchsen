import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { GenericResponseBody } from "~types";

export type GetVODInfoRequest = {
  video_id: string;
  oauth: string;
  client_id: string;
};

export type GetVODInfoResponse = {
  channelname: string;
  created_at: string;
  length: number;
};

const handler: PlasmoMessaging.MessageHandler<
  GetVODInfoRequest,
  GenericResponseBody<GetVODInfoResponse>
> = async (req, res) => {
  if (!req.body) {
    res.send({ error: "Missing request body" });
    return;
  }

  const { video_id, oauth, client_id } = req.body;

  try {
    const apiRes = await fetch(`https://gql.twitch.tv/gql`, {
      method: "POST",
      headers: {
        authorization: oauth,
        client_id
      },
      body: JSON.stringify([
        {
          operationName: "VideoMetadata",
          variables: {
            channelLogin: "",
            videoID: video_id
          },
          extensions: {
            persistedQuery: {
              version: 1,
              sha256Hash:
                "45111672eea2e507f8ba44d101a61862f9c56b11dee09a15634cb75cb9b9084d"
            }
          }
        }
      ])
    });

    if (!apiRes.ok) {
      throw new Error();
    }

    const data = await apiRes.json();

    if (!data[0].data) {
      throw new Error();
    }

    res.send({
      data: {
        channelname: data[0].data.video.owner.login,
        created_at: data[0].data.video.createdAt,
        length: data[0].data.video.lengthSeconds
      }
    });
  } catch (error) {
    console.error(error);
    res.send({ error: "Failed to get VOD details" });
  }
};

export default handler;
