export const getTwitchTokens = () => {
  const cookie = document.cookie;

  return {
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
};

export * from "./state";
export * from "./backgroundWrapper";
