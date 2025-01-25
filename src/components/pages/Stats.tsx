import { memo, useMemo } from "react";
import {
  calculateTopChatters,
  calculateTopEmotes
} from "~components/stats/helper";
import TopChatters from "~components/stats/TopChatters";
import TopEmotes from "~components/stats/TopEmotes";
import { useAppSelector } from "~hooks/redux";

const Stats = memo(function Stats() {
  const emotes = useAppSelector((state) => state.log.emotes);
  const logs = useAppSelector((state) => state.log.logs);

  const topEmotes = useMemo(
    () => calculateTopEmotes(emotes, logs),
    [emotes, logs]
  );

  const topChatters = useMemo(() => calculateTopChatters(logs), [logs]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-4xl font-bold">Stream Stats</h1>
      <TopEmotes topEmotes={topEmotes} />
      <TopChatters topChatters={topChatters} />
    </div>
  );
});

export default Stats;
