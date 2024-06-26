"use client";

import { useEffect } from "react";

import { notification } from "antd";

import { useDispatch, useSelector } from "@/stores/Store";
import type { AppState } from "@/stores/Store";
import { handlerNotificationError } from "@/stores/reducers/NotificationReducer";

import { NotificationTypeConst } from "@/constants/NotificationConstants";

const NotificationError = () => {
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();

  const { isOpen, type, key, title, description } = useSelector(
    (state: AppState) => state.NotificationReducer
  );

  useEffect(() => {
    if (isOpen && type === NotificationTypeConst.ERROR) {
      api.error({
        key,
        message: title,
        description: (
          <div dangerouslySetInnerHTML={{ __html: description || "" }} />
        ),
        onClose: () => {
          dispatch(
            handlerNotificationError({
              isOpen: false,
              type: undefined,
              key: undefined,
              title: undefined,
              description: undefined,
            })
          );
        },
      });
    }
  }, [isOpen, type, key, title, description]);

  return <>{contextHolder}</>;
};

export default NotificationError;
