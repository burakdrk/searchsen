/**
 * A constant array containing URLs of saved API links.
 * Used in case zonian.dev API fails to fetch these links.
 * If none of these links work, the extension will fallback to using the Twitch API. (Slower)
 */
export const SAVED_API_LINKS = [
  "https://logs.ivr.fi",
  "https://logs.spanix.team",
  "https://logs.susgee.dev"
];

export const CHUNKED_MESSAGE_FLAG = "CHUNKED_MESSAGE_FLAG";

export const MAX_CHUNK_SIZE = 31 * 1024 * 1024; // 31Mb
