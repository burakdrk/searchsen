import { sendToBackground } from "@plasmohq/messaging";
import type { GetLogsFromJustlogRequest } from "~background/messages/getLogsFromJustlog";
import type {
  GetVODInfoRequest,
  GetVODInfoResponse
} from "~background/messages/getVODInfo";
import type { GenericResponseBody, Logs } from "~types";

export const getVODInfo = ({
  video_id,
  oauth,
  client_id
}: GetVODInfoRequest) => {
  return sendToBackground<
    GetVODInfoRequest,
    GenericResponseBody<GetVODInfoResponse>
  >({
    name: "getVODInfo",
    body: {
      video_id,
      oauth,
      client_id
    }
  });
};

export const getAPILinks = (channelname: string) => {
  return sendToBackground<string, GenericResponseBody<string[]>>({
    name: "getAPILinks",
    body: channelname
  });
};

export const getLogsFromJustlog = ({
  baseURL,
  channelName,
  from,
  to
}: GetLogsFromJustlogRequest) => {
  return sendToBackground<
    GetLogsFromJustlogRequest,
    GenericResponseBody<Logs[]>
  >({
    name: "getLogsFromJustlog",
    body: {
      baseURL,
      channelName,
      from,
      to
    }
  });
};
