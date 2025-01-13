type PageType = "search" | "settings" | "stats";

export type State = {
  currentPage: PageType;
  searchValue: string;

  window: {
    width: number;
    height: number;
    x: number;
    y: number;
  };

  searchOptions: {
    searchMode: "text" | "regex";
    isCaseSensitive: boolean;
    isUsernameSearch: boolean;
  };
};

export type Actions = {
  setCurrentPage: (page: PageType) => void;
  setSearchValue: (value: string) => void;

  searchOptions: {
    setSearchMode: (mode: "text" | "regex") => void;
    setIsCaseSensitive: (value: boolean) => void;
    setIsUsernameSearch: (value: boolean) => void;
  };

  window: {
    setSize: (width: number, height: number) => void;
    setPosition: (x: number, y: number) => void;
  };
};
