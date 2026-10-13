import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    counter: 0
  },
  reducers: {
    incrementActiveCallsCount: (state) => {
      state.counter += 1
    },
    decrementActiveCallsCount: (state) => {
      state.counter -= 1
    }
  }
})

export const { incrementActiveCallsCount, decrementActiveCallsCount } = loaderSlice.actions
export default loaderSlice.reducer