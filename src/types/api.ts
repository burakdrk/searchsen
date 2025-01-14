export type GenericResponseBody<T> = {
  data?: T;
  error?: string;
};

export type JustlogResponse = {
  messages: JustlogMessage[];
};

type JustlogMessage = {
  text: string;
  displayName: string;
  timestamp: string;
  id: string;
  tags: JustlogTags;
};

type JustlogTags = {
  emotes: string;
  color?: string;
};

export type Logs = {
  secs: number;
  intoVod: string;
  user: string;
  message: string;
  color: string;
  emotes: TwtichEmote[];
};

export type TwtichEmote = { emoteId: string; start: number; end: number };
