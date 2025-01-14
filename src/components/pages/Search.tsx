import SearchInput from "~components/inputs/SearchInput";
import { IoTrashOutline } from "react-icons/io5";
import IconButton from "~components/inputs/IconButton";
import { useStore } from "~utils";
import useGetLogs from "~hooks/useGetLogs";
import { Virtuoso } from "react-virtuoso";
import { useEffect, useState } from "react";
import useDebounce from "~hooks/useDebounce";
import type { Logs } from "~types";

const handleTimeUpdate = (seconds: number) => {
  document.getElementsByTagName("video")[0].currentTime = seconds;
};

function Search() {
  const setSearchValue = useStore((state) => state.setSearchValue);
  const searchValue = useStore((state) => state.searchValue);
  const height = useStore((state) => state.window.height);

  const { data } = useGetLogs();

  const debouncedSearch = useDebounce(searchValue, 500);

  const [results, setResults] = useState<Logs[]>([]);

  useEffect(() => {
    console.log("searchsen + seasrching");
    if (debouncedSearch.length < 2) setResults([]);
    else
      setResults(data.filter((log) => log.message.includes(debouncedSearch)));
  }, [data, debouncedSearch]);

  return (
    <>
      <div className="h-12 flex items-center justify-between gap-2 mb-5">
        <SearchInput
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
        <IconButton
          className="p-2"
          onClick={() => {
            setSearchValue("");
          }}
        >
          <IoTrashOutline className="h-8 w-8" />
        </IconButton>
      </div>

      <div style={{ height: height - 115 }} className="text-2xl ml-[-1.5rem]">
        <Virtuoso
          style={{ height: "100%" }}
          data={results}
          itemContent={(_, log) => (
            <button
              className="p-2 pl-6 w-full text-left break-words hover:bg-hover-bg transition-colors
                duration-100 ease-in-out"
              onClick={() => handleTimeUpdate(log.secs)}
            >
              <span className="text-[#ffffffbf] text-base align-middle">
                {log.intoVod}
              </span>{" "}
              <span style={{ color: log.color }} className="font-bold">
                {log.user}
              </span>
              : <span>{log.message}</span>
            </button>
          )}
        />
      </div>
    </>
  );
}

export default Search;
