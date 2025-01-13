import type { State, Actions } from "~types";

import { create } from "zustand";

const useStore = create<State & Actions>((set) => {
  console.log("Creating store");

  return {
    currentPage: "search",
    searchValue: "",

    window: {
      width: 700,
      height: 550,
      x: (window.innerWidth - 700) / 2,
      y: (window.innerHeight - 550) / 2,

      setSize: (width, height) =>
        set((state) => ({
          window: { ...state.window, width, height }
        })),

      setPosition: (x, y) =>
        set((state) => ({
          window: { ...state.window, x, y }
        }))
    },

    searchOptions: {
      searchMode: "text",
      isCaseSensitive: false,
      isUsernameSearch: false,

      setSearchMode: (mode) =>
        set((state) => ({
          searchOptions: { ...state.searchOptions, searchMode: mode }
        })),

      setIsCaseSensitive: (value) =>
        set((state) => ({
          searchOptions: { ...state.searchOptions, isCaseSensitive: value }
        })),

      setIsUsernameSearch: (value) =>
        set((state) => ({
          searchOptions: { ...state.searchOptions, isUsernameSearch: value }
        }))
    },

    setCurrentPage: (page) => set({ currentPage: page }),

    setSearchValue: (value) => set({ searchValue: value })
  };
});

export { useStore };
