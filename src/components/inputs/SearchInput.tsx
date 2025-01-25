import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import IconButton from "./IconButton";
import { IoIosCheckmark } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "~hooks/redux";
import {
  setIsCaseSensitive,
  setIsUsernameSearch,
  setSearchMode
} from "~store/appSlice";

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

function SearchInput({ ...props }: SearchInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchOptions = useAppSelector((state) => state.app.searchOptions);
  const dispatch = useAppDispatch();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      const path = e.composedPath();
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !path.includes(dropdownRef.current) &&
        !path.includes(buttonRef.current)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  return (
    <div className="relative w-full z-10">
      <input
        className="border-2 border-solid bg-transparent border-default-border text-text-default
          active:border-accent focus:border-accent focus:outline-none rounded-lg px-4 py-2
          w-full text-2xl pr-12"
        type="search"
        placeholder={
          !searchOptions.isUsernameSearch
            ? `Enter ${searchOptions.searchMode} to search`
            : "Enter username to search"
        }
        {...props}
      />
      <div
        className="absolute top-0 right-0 h-full flex items-center p-2"
        ref={buttonRef}
      >
        <IconButton onClick={() => setDropdownOpen(!dropdownOpen)}>
          <BsThreeDots className="h-8 w-8 p-1" />
        </IconButton>

        <div
          ref={dropdownRef}
          className={`absolute top-12 right-0 w-64 bg-dark rounded-md border border-default-border
            ${dropdownOpen ? "block" : "hidden"} text-xl`}
        >
          <button
            className="w-full text-left px-4 py-2 hover:bg-default-border flex justify-between"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setSearchMode("text"));
            }}
          >
            Text search
            {searchOptions.searchMode === "text" && (
              <IoIosCheckmark className="h-7 w-7 inline-block ml-2" />
            )}
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-default-border flex justify-between"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setSearchMode("regex"));
              dispatch(setIsCaseSensitive(false));
              dispatch(setIsUsernameSearch(false));
            }}
          >
            Regex search
            {searchOptions.searchMode === "regex" && (
              <IoIosCheckmark className="h-7 w-7 inline-block ml-2" />
            )}
          </button>
          {searchOptions.searchMode !== "regex" && (
            <>
              <div className="h-0.5 bg-default-border w-full"></div>

              {!searchOptions.isUsernameSearch && (
                <>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-default-border flex justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        setIsCaseSensitive(!searchOptions.isCaseSensitive)
                      );
                    }}
                  >
                    Case sensitive
                    {searchOptions.isCaseSensitive && (
                      <IoIosCheckmark className="h-7 w-7 inline-block ml-2" />
                    )}
                  </button>
                </>
              )}

              <button
                className="w-full text-left px-4 py-2 hover:bg-default-border flex justify-between"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    setIsUsernameSearch(!searchOptions.isUsernameSearch)
                  );
                  dispatch(setIsCaseSensitive(false));
                }}
              >
                Username search
                {searchOptions.isUsernameSearch && (
                  <IoIosCheckmark className="h-7 w-7 inline-block ml-2" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchInput;
