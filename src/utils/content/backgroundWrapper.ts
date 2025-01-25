import { sendToBackground } from "@plasmohq/messaging";
import type { GetChunksResponse } from "~background/messages/getChunks";
import type {
  GetLogsFromJustlogRequest,
  GetLogsFromJustlogResponse
} from "~background/messages/getLogsFromJustlog";
import type {
  GetLogsFromTwitchRequest,
  GetLogsFromTwitchResponse
} from "~background/messages/getLogsFromTwitch";
import type {
  GetVODInfoRequest,
  GetVODInfoResponse
} from "~background/messages/getVODInfo";
import type { GenericResponseBody } from "~types";

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
  to,
  channelID
}: GetLogsFromJustlogRequest) => {
  return sendToBackground<
    GetLogsFromJustlogRequest,
    GenericResponseBody<GetLogsFromJustlogResponse>
  >({
    name: "getLogsFromJustlog",
    body: {
      baseURL,
      channelName,
      from,
      to,
      channelID
    }
  });
};

export const getChunks = (chunkID: string) => {
  return sendToBackground<string, GenericResponseBody<GetChunksResponse>>({
    name: "getChunks",
    body: chunkID
  });
};

export const getLogsFromTwitch = ({
  tokens,
  offset,
  cursor,
  channelID
}: GetLogsFromTwitchRequest) => {
  return sendToBackground<
    GetLogsFromTwitchRequest,
    GenericResponseBody<GetLogsFromTwitchResponse>
  >({
    name: "getLogsFromTwitch",
    body: {
      tokens,
      offset,
      cursor,
      channelID
    }
  });
};
