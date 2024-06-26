import { createSlice } from "@reduxjs/toolkit";

import { LanguageConst } from "@/constants/LocaleConstants";

interface IState {
  webStart: boolean;
  language: string;
}

const initialState: IState = {
  webStart: false,
  language: LanguageConst.EN,
};

export const CommonReducer = createSlice({
  name: "Common",
  initialState,
  reducers: {
    webStart: (state: IState) => {
      state.webStart = true;
    },

    setLanguage: (state: IState, actions) => {
      state.language = actions.payload;
    },
  },
});

export const { webStart, setLanguage } = CommonReducer.actions;

export default CommonReducer.reducer;
