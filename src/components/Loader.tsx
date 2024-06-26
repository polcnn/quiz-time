"use client";

import { useEffect } from "react";

import { Spin } from "antd";

import { useSelector, useDispatch } from "@/stores/Store";
import type { AppState } from "@/stores/Store";
import { webStart } from "@/stores/reducers/CommonReducer";
import { hideLoading } from "@/stores/reducers/LoaderReducer";

const Loader = () => {
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state: AppState) => state.LoaderReducer);

  useEffect(() => {
    dispatch(webStart());
    dispatch(hideLoading());
  }, []);

  if (!isLoading) return null;

  return (
    <div className="x-loader">
      <Spin size="large" />
    </div>
  );
};

export default Loader;
