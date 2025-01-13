import { sendToBackground } from "@plasmohq/messaging";
import type { GetLogsFromJustlogRequest } from "~background/messages/getLogsFromJustLog";
import type {
  GetVODInfoRequest,
  GetVODInfoResponse
} from "~background/messages/getVODInfo";
import type { GenericResponseBody } from "~types";

const SEARCHSEN_EXT_ID = "ichpdcknemodiobolcgiipfchoanoken";

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
    },
    extensionId: SEARCHSEN_EXT_ID
  });
};

export const getAPILinks = (channelname: string) => {
  return sendToBackground<string, GenericResponseBody<string[]>>({
    name: "getAPILinks",
    body: channelname,
    extensionId: SEARCHSEN_EXT_ID
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
    GenericResponseBody<unknown>
  >({
    name: "getLogsFromJustlog",
    body: {
      baseURL,
      channelName,
      from,
      to
    },
    extensionId: SEARCHSEN_EXT_ID
  });
};
