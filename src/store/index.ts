import { configureStore } from "@reduxjs/toolkit";
import RootReducer from "./rootReducer";
import { NODE_ENV } from "../../secret";

export const store = configureStore({
  reducer: RootReducer,
  devTools: NODE_ENV !== "production",
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
