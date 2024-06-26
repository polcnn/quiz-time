import { configureStore } from "@reduxjs/toolkit";

import { combineReducers } from "redux";

import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import CommonReducer from "./reducers/CommonReducer";
import NotificationReducer from "./reducers/NotificationReducer";
import LoaderReducer from "./reducers/LoaderReducer";

const reducerConfig = {
  CommonReducer,
  NotificationReducer,
  LoaderReducer,
};

export const store = configureStore({
  reducer: reducerConfig,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

const rootReducer = combineReducers(reducerConfig);

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const { dispatch } = store;
export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<AppState> = useAppSelector;

export default store;
