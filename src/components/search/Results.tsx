import { Virtuoso } from "react-virtuoso";
import toast from "react-hot-toast";
import Toast from "~components/ui/Toast";
import type { Logs } from "~types";
import Message from "./Message";
import { useAppSelector } from "~hooks/redux";

const handleTimeUpdate = (seconds: number) => {
  document.getElementsByTagName("video")[0].currentTime = seconds;
};

const padZero = (num: number): string => num.toString().padStart(2, "0");

const strDifference = (secs: number): string => {
  const h = Math.floor(secs / 3600);
  secs %= 3600;
  const m = Math.floor(secs / 60);
  const s = secs % 60;

  return `${padZero(h)}h${padZero(m)}m${padZero(s)}s`;
};

type ResultsProps = {
  results: Logs[];
};

function Results({ results }: ResultsProps) {
  const height = useAppSelector((state) => state.app.window.height);

  return (
    <div style={{ height: height - 115 }} className="text-2xl ml-[-1.5rem]">
      <Virtuoso
        style={{ height: "100%" }}
        data={results}
        itemContent={(_, log) => (
          <button
            className="p-2 pl-6 w-full text-left break-words hover:bg-hover-bg transition-colors
              duration-100 ease-in-out min-h-16"
            onClick={() => handleTimeUpdate(log.s)}
          >
            <span className="text-[#ffffffbf] text-base align-middle">
              {strDifference(log.s)}
            </span>{" "}
            <span
              style={{ color: log.c }}
              className="font-bold"
              onContextMenu={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(log.u);
                toast.custom((t) => (
                  <Toast
                    id={t.id}
                    message="Copied username"
                    visible={t.visible}
                  />
                ));
              }}
            >
              {log.u}
            </span>
            :{" "}
            <Message
              message={log.m}
              onContextMenu={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(log.m);
                toast.custom((t) => (
                  <Toast
                    id={t.id}
                    message="Copied message"
                    visible={t.visible}
                  />
                ));
              }}
            />
          </button>
        )}
      />
    </div>
  );
}

export default Results;
