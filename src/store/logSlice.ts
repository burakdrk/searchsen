import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Emote, Logs } from "~types";

type LogState = {
  logs: Logs[];
  fetchedFor: string | null;
  emotes: Record<string, Emote>;
  length: number;
  isLoading: boolean;
};

const initialState: LogState = {
  logs: [],
  fetchedFor: null,
  emotes: {},
  length: 0,
  isLoading: false
};

export const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    setLogs: (
      state,
      action: PayloadAction<{ logs: Logs[]; fetchedFor: string }>
    ) => {
      state.logs = action.payload.logs;
      state.fetchedFor = action.payload.fetchedFor;
    },
    setEmotes: (state, action: PayloadAction<Record<string, Emote>>) => {
      state.emotes = action.payload;
    },
    setLength: (state, action: PayloadAction<number>) => {
      state.length = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setLogs, setEmotes, setLength, setIsLoading } = logSlice.actions;

export default logSlice.reducer;
