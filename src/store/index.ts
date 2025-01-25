import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import logSlice from "./logSlice";

export const store = configureStore({
  reducer: {
    app: appSlice,
    log: logSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
