import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { setSearchValue } from "~store/appSlice";

// FIXME: Properly implement the useAutocomplete hook
function useAutocomplete() {
  const searchValue = useAppSelector((state) => state.app.searchValue);
  const emotes = useAppSelector((state) => state.log.emotes);

  const dispatch = useAppDispatch();

  const getClosestMatch = useCallback(
    (input: string) => {
      return Object.keys(emotes)
        .filter((s) => s.toLowerCase().startsWith(input.toLowerCase()))
        .sort((a, b) => a.length - b.length)[0];
    },
    [emotes]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();

        const match = getClosestMatch(searchValue);

        if (match) {
          const base = searchValue.split(" ").slice(0, -1).join(" ");
          dispatch(setSearchValue(base + (base ? " " : "") + match));
        }
      }
    },
    [dispatch, getClosestMatch, searchValue]
  );

  return handleKeyDown;
}

export default useAutocomplete;
