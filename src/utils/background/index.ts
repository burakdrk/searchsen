type TwitchEmote = {
  id: string;
  start: number;
  end: number;
};

export const parseTwitchEmotes = (emotesString: string) => {
  const emotes: TwitchEmote[] = [];

  if (!emotesString) return emotes;

  emotesString.split("/").forEach((entry) => {
    const [emoteId, positions] = entry.split(":");
    positions.split(",").forEach((pos) => {
      const [start, end] = pos.split("-").map(Number);
      emotes.push({ id: emoteId, start, end });
    });
  });

  return emotes;
};
