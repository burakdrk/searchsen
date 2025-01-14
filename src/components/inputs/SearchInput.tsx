import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import IconButton from "./IconButton";
import { IoIosCheckmark } from "react-icons/io";
import { useStore } from "~utils";

type SearchInputProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

function SearchInput({ onChange, value }: SearchInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchOptions = useStore((state) => state.searchOptions);

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
        className="border-2 border-solid bg-transparent border-[#434343] text-text-default
          active:border-accent focus:border-accent focus:outline-none rounded-lg px-4 py-2
          w-full text-2xl pr-12"
        type="search"
        placeholder={
          !searchOptions.isUsernameSearch
            ? `Enter ${searchOptions.searchMode} to search`
            : "Enter username to search"
        }
        value={value}
        onChange={onChange}
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
          className={`absolute top-12 right-0 w-64 bg-[#1f1f23] rounded-md border border-[#434343]
            ${dropdownOpen ? "block" : "hidden"} text-xl`}
        >
          <button
            className="w-full text-left px-4 py-2 hover:bg-[#434343] flex justify-between"
            onClick={(e) => {
              e.stopPropagation();
              searchOptions.setSearchMode("text");
            }}
          >
            Text search
            {searchOptions.searchMode === "text" && (
              <IoIosCheckmark className="h-7 w-7 inline-block ml-2" />
            )}
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-[#434343] flex justify-between"
            onClick={(e) => {
              e.stopPropagation();
              searchOptions.setSearchMode("regex");
              searchOptions.setIsCaseSensitive(false);
              searchOptions.setIsUsernameSearch(false);
            }}
          >
            Regex search
            {searchOptions.searchMode === "regex" && (
              <IoIosCheckmark className="h-7 w-7 inline-block ml-2" />
            )}
          </button>
          {searchOptions.searchMode !== "regex" && (
            <>
              <div className="h-0.5 bg-[#434343] w-full"></div>

              {!searchOptions.isUsernameSearch && (
                <>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[#434343] flex justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      searchOptions.setIsCaseSensitive(
                        !searchOptions.isCaseSensitive
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
                className="w-full text-left px-4 py-2 hover:bg-[#434343] flex justify-between"
                onClick={(e) => {
                  e.stopPropagation();
                  searchOptions.setIsUsernameSearch(
                    !searchOptions.isUsernameSearch
                  );
                  searchOptions.setIsCaseSensitive(false);
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
