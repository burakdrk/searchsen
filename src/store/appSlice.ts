import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type PageType = "search" | "settings" | "stats";

type AppState = {
  currentPage: PageType;
  window: {
    width: number;
    height: number;
  };
  searchOptions: {
    searchMode: "text" | "regex";
    isCaseSensitive: boolean;
    isUsernameSearch: boolean;
  };
  searchValue: string;
};

const initialState: AppState = {
  currentPage: "search",
  window: {
    width: 700,
    height: 550
  },
  searchOptions: {
    searchMode: "text",
    isCaseSensitive: false,
    isUsernameSearch: false
  },
  searchValue: ""
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<PageType>) => {
      state.currentPage = action.payload;
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    setSize: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.window.width = action.payload.width;
      state.window.height = action.payload.height;
    },
    setSearchMode: (state, action: PayloadAction<"text" | "regex">) => {
      state.searchOptions.searchMode = action.payload;
    },
    setIsCaseSensitive: (state, action: PayloadAction<boolean>) => {
      state.searchOptions.isCaseSensitive = action.payload;
    },
    setIsUsernameSearch: (state, action: PayloadAction<boolean>) => {
      state.searchOptions.isUsernameSearch = action.payload;
    }
  }
});

export const {
  setCurrentPage,
  setSize,
  setSearchMode,
  setIsCaseSensitive,
  setIsUsernameSearch,
  setSearchValue
} = appSlice.actions;

export default appSlice.reducer;
