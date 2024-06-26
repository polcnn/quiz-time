"use client";

import { Provider } from "react-redux";

import Store from "./Store";

interface IProps {
  children: JSX.Element | JSX.Element[];
}

const ReduxProvider = ({ children }: IProps) => {
  return <Provider store={Store}>{children}</Provider>;
};

export default ReduxProvider;
