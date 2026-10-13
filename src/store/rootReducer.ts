import { combineReducers } from "@reduxjs/toolkit";
import loaderReducer from "./slices/loaderSlice";
import toastReducer from "./slices/toastSlice";
import navigationReducer from "./slices/navigationSlice";
import searchResultReducer from "./slices/searchResultSlice";

const RootReducer = combineReducers({
  loader: loaderReducer,
  toast: toastReducer,
  navigation: navigationReducer,
  searchResult: searchResultReducer,
});

export default RootReducer;
