type TopChattersProps = {
  topChatters: {
    name: string;
    count: number;
  }[];
};
function TopChatters({ topChatters }: TopChattersProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Top Chatters</h2>

      <div className="space-y-3 overflow-hidden">
        {topChatters.map((chatter, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg transition-all shadow-xl
            hover:scale-[1.02] ${index === 0 && " text-2xl font-bold"} ${ index === 1 &&
            " text-xl font-semibold" } ${index === 2 && "-50 text-lg font-semibold"} ${
            index > 2 && "text-base" }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${ index === 0 &&
                "bg-amber-400 text-white" } ${index === 1 && "bg-gray-400 text-white"} ${ index
                === 2 && "bg-orange-400 text-white" } ${index > 2 && "bg-black"} `}
              >
                {index + 1}
              </span>
              <span>{chatter.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-default">
                {chatter.count} messages
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopChatters;
