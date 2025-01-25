import type { TwitchTokens } from "~types";

export * from "./backgroundWrapper";
export * from "./heatmap";

export function getTwitchTokens(): TwitchTokens | null {
  const cookie = document.cookie;

  const newTokens = {
    video_id: /twitch\.tv\/videos\/(\d+)/.exec(window.location.href)?.[1],
    oauth: /(?<=%22authToken%22:%22).+?(?=%22)/.exec(cookie)?.[0]
      ? "OAuth " + /(?<=%22authToken%22:%22).+?(?=%22)/.exec(cookie)?.[0]
      : undefined,
    client_id: /(?<="Client-ID":"|clientId=").+?(?=")/.exec(
      Array.from(document.getElementsByTagName("script"))?.filter((i) =>
        /(?<="Client-ID":"|clientId=").+?(?=")/.test(i.innerHTML)
      )?.[0].innerHTML
    )?.[0],
    unique_id:
      cookie.match("(^|;)\\s*" + "unique_id" + "\\s*=\\s*([^;]+)")?.pop() ||
      undefined
  };

  const { video_id, oauth, client_id, unique_id } = newTokens;

  if (!video_id || !oauth || !client_id || !unique_id) {
    return null;
  }

  return { video_id, oauth, client_id, unique_id };
}

export function debounceFn<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
