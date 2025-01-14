import type { TwtichEmote } from "~types";

export const parseTwitchEmotes = (emotesString: string) => {
  const emotes: TwtichEmote[] = [];

  if (!emotesString) return emotes;

  emotesString.split("/").forEach((entry) => {
    const [emoteId, positions] = entry.split(":");
    positions.split(",").forEach((pos) => {
      const [start, end] = pos.split("-").map(Number);
      emotes.push({ emoteId, start, end });
    });
  });

  return emotes.sort((a, b) => b.start - a.start);
};

const padZero = (num: number): string => num.toString().padStart(2, "0");

export const strDifference = (secs: number): string => {
  const h = Math.floor(secs / 3600);
  secs %= 3600;
  const m = Math.floor(secs / 60);
  const s = secs % 60;

  return `${padZero(h)}h${padZero(m)}m${padZero(s)}s`;
};
