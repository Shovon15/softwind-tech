import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const searchResultInitialState: ISearchResultState = {
  inputValue: "",
  searchResult: [],
  keyWord: "",
  query: "",
  loadMoreUrl: null,
};

const searchResultSlice = createSlice({
  name: "searchResult",
  initialState: searchResultInitialState,
  reducers: {
    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setLoadMoreUrl: (state, action: PayloadAction<string | null>) => {
      state.loadMoreUrl = action.payload;
    },
    setSearchResultsInState: (
      state,
      action: PayloadAction<Partial<ISearchResultState>>,
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  setInputValue,
  setQuery,
  setLoadMoreUrl,
  setSearchResultsInState,
} = searchResultSlice.actions;
export default searchResultSlice.reducer;
