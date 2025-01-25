import SearchInput from "~components/inputs/SearchInput";
import { IoTrashOutline } from "react-icons/io5";
import IconButton from "~components/inputs/IconButton";
import useDebounce from "~hooks/useDebounce";
import { debounceFn, drawHeatmap } from "~utils/content";
import useAutocomplete from "~hooks/useAutocomplete";
import useSearch from "~hooks/useSearch";
import { SlGraph } from "react-icons/sl";
import type { Logs } from "~types";
import Tooltip from "~components/ui/Tooltip";
import Results from "~components/search/Results";
import { useAppDispatch, useAppSelector } from "~hooks/redux";
import { setSearchValue } from "~store/appSlice";

declare global {
  interface Window {
    searchsen_resize_observer: ResizeObserver;
  }
}

function handleDraw(results: Logs[], vodLength: number) {
  drawHeatmap(results, vodLength);

  const element = document.querySelector(".seekbar-bar");
  if (!element) return;

  if (window.searchsen_resize_observer) {
    window.searchsen_resize_observer.disconnect();
  }

  const debouncedDrawHeatmap = debounceFn(
    () => drawHeatmap(results, vodLength),
    500
  );

  window.searchsen_resize_observer = new ResizeObserver(() => {
    debouncedDrawHeatmap();
  });

  window.searchsen_resize_observer.observe(element);
}

function Search() {
  const searchValue = useAppSelector((state) => state.app.searchValue);
  const vodLength = useAppSelector((state) => state.log.length);
  const dispatch = useAppDispatch();

  const onKeyDown = useAutocomplete();
  const debouncedSearch = useDebounce(searchValue, 500);

  const results = useSearch(debouncedSearch);

  return (
    <>
      <div className="h-12 flex items-center justify-between gap-2 mb-5">
        <SearchInput
          onChange={(e) => dispatch(setSearchValue(e.target.value))}
          value={searchValue}
          onKeyDown={onKeyDown}
        />
        <IconButton
          className="p-2"
          onClick={() => {
            dispatch(setSearchValue(""));
            document.getElementById("searchsen-heatmap")?.remove();
            window.searchsen_resize_observer?.disconnect();
          }}
        >
          <IoTrashOutline className="h-8 w-8" />
        </IconButton>
        <Tooltip content="Draw heatmap" position="bottom">
          <IconButton
            disabled={results.length === 0}
            className="p-2"
            onClick={() => handleDraw(results, vodLength)}
          >
            <SlGraph className="h-8 w-8" />
          </IconButton>
        </Tooltip>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[80%] text-2xl">
          No results found
        </div>
      ) : (
        <Results results={results} />
      )}
    </>
  );
}

export default Search;
