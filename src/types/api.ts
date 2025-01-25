export type GenericResponseBody<T> = {
  data?: T;
  error?: string;
};

type JustlogMessage = {
  text: string;
  displayName: string;
  timestamp: string;
  id: string;
  tags: {
    emotes: string;
    color?: string;
  };
};

export type JustlogResponse = {
  messages: JustlogMessage[];
};

export type Logs = {
  s: number;
  u: string;
  m: string;
  c: string;
};

export type Emote = {
  name: string;
  url: string;
  type: "twitch" | "bttv" | "7tv" | "ffz";
};

export type TwitchTokens = {
  video_id: string;
  oauth: string;
  client_id: string;
  unique_id: string;
};
