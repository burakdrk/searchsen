import { useEffect, useState } from "react";
import type { Logs } from "~types";
import { useAppSelector } from "./redux";

const searchFunctions = {
  regex: (log: Logs, pattern: string): boolean => {
    try {
      return new RegExp(pattern).test(log.m);
    } catch {
      return false;
    }
  },
  username: (log: Logs, pattern: string): boolean =>
    log.u.toLowerCase() === pattern.toLowerCase(),

  caseSensitive: (log: Logs, pattern: string): boolean =>
    log.m.includes(pattern),

  caseInsensitive: (log: Logs, pattern: string): boolean =>
    log.m.toLowerCase().includes(pattern.toLowerCase())
};

function useSearch(pattern: string) {
  const data = useAppSelector((state) => state.log.logs);
  const searchOptions = useAppSelector((state) => state.app.searchOptions);

  const [results, setResults] = useState<Logs[]>([]);

  useEffect(() => {
    if (pattern.length < 2) {
      setResults([]);
      return;
    }

    let searchFunction: (log: Logs, pattern: string) => boolean;

    if (searchOptions.searchMode === "regex") {
      searchFunction = searchFunctions.regex;
    } else if (searchOptions.isUsernameSearch) {
      searchFunction = searchFunctions.username;
    } else if (searchOptions.isCaseSensitive) {
      searchFunction = searchFunctions.caseSensitive;
    } else {
      searchFunction = searchFunctions.caseInsensitive;
    }

    const newResults = data.filter((log) => searchFunction(log, pattern));
    setResults(newResults);
  }, [
    data,
    pattern,
    searchOptions.isCaseSensitive,
    searchOptions.isUsernameSearch,
    searchOptions.searchMode
  ]);

  return results;
}

export default useSearch;
