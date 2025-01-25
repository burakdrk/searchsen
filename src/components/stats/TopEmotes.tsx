type TopEmoteProps = {
  topEmotes: {
    name: string;
    count: number;
    url: string;
  }[];
};

function TopEmotes({ topEmotes }: TopEmoteProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Top Emotes</h2>

      <div className="flex flex-wrap gap-4 overflow-hidden">
        {topEmotes.map((emote, index) => (
          <div
            key={emote.name}
            className={`rounded-lg flex flex-col items-center p-4 min-w-[200px] flex-1 hover:scale-110
            transition-transform ${index < 3 ? "text-2xl font-bold" : "text-xl"}`}
          >
            <div className="relative mb-3">
              <img
                src={emote.url}
                alt={emote.name}
                className={`object-contain ${index === 0 ? "scale-125" : ""}
                ${index === 1 ? "scale-110" : ""} ${index === 2 ? " scale-105" : ""}`}
              />
              <span
                className="absolute -top-2 -left-2 bg-accent text-white text-sm rounded-full w-6 h-6 flex
                  items-center justify-center"
              >
                {index + 1}
              </span>
            </div>
            <span className="mb-1">{emote.name}</span>
            <span className="text-base opacity-75">{emote.count} uses</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopEmotes;
