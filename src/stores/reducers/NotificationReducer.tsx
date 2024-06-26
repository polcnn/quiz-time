import { createSlice } from "@reduxjs/toolkit";

import { uniqueId } from "lodash";

import { NotificationTypeConst } from "@/constants/NotificationConstants";

interface IState {
  isOpen: boolean;
  key: string | undefined;
  type: string | undefined;
  title: string | undefined;
  description: string | undefined;
}

const initialState: IState = {
  key: undefined,
  type: undefined,
  isOpen: false,
  title: undefined,
  description: undefined,
};

export const NotificationReducer = createSlice({
  name: "Notification",
  initialState,
  reducers: {
    handlerNotificationSuccess: (state: IState, actions) => {
      const isOpen: boolean = actions.payload?.isOpen || false;
      const title: string = actions.payload?.title || "Successfully";
      const description: string =
        actions.payload?.description || "Please type again";

      state.key = uniqueId();
      state.type = NotificationTypeConst.SUCCESS;
      state.isOpen = isOpen;
      state.title = title;
      state.description = description;
    },

    handlerNotificationError: (state: IState, actions) => {
      const isOpen: boolean = actions.payload?.isOpen || false;
      const title: string = actions.payload?.title || "Failed";
      const description: string =
        actions.payload?.description || "Please type again";

      state.key = uniqueId();
      state.type = NotificationTypeConst.ERROR;
      state.isOpen = isOpen;
      state.title = title;
      state.description = description;
    },
  },
});

export const { handlerNotificationSuccess, handlerNotificationError } =
  NotificationReducer.actions;

export default NotificationReducer.reducer;
