import { createSlice } from "@reduxjs/toolkit";

interface IState {
  isLoading: boolean;
}

const initialState: IState = {
  isLoading: true,
};

export const LoaderReducer = createSlice({
  name: "Loader",
  initialState,
  reducers: {
    showLoading: (state: IState) => {
      state.isLoading = true;
    },

    hideLoading: (state: IState) => {
      state.isLoading = false;
    },
  },
});

export const { showLoading, hideLoading } = LoaderReducer.actions;

export default LoaderReducer.reducer;
