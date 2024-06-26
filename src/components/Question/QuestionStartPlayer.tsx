"use client";

import { useEffect } from "react";

import Link from "next/link";

import { parseCookies, setCookie } from "nookies";

import { Space, Card, Form, Input, Button } from "antd";
import type { FormProps } from "antd";

import { doRedirect } from "@/app/actions";

import { useSelector, useDispatch } from "@/stores/Store";
import type { AppState } from "@/stores/Store";
import { showLoading, hideLoading } from "@/stores/reducers/LoaderReducer";
import { handlerNotificationError } from "@/stores/reducers/NotificationReducer";

import type { IHttpResponse } from "@/types/http";
import type { IFormEnterName } from "@/types/question";

import PlayerModel from "@/models/PlayerModel";

import { LogResponse } from "@/utils/LogUtil";
import { CryptoEncrypt } from "@/utils/CryptoUtils";

import { ResponseStatusConst } from "@/constants/AppConstants";
import { PlayerKeyConst } from "@/constants/QuestionConstants";

const initialValues: IFormEnterName = {
  name: "",
};

const QuestionStartPlayer = () => {
  const dispatch = useDispatch();
  const cookies = parseCookies();

  const { webStart } = useSelector((state: AppState) => state.CommonReducer);

  useEffect(() => {
    if (webStart) {
      initPlayer();
    }
  }, [webStart]);

  const initPlayer = async () => {
    try {
      dispatch(showLoading());

      const playJoin: string | undefined =
        cookies?.[PlayerKeyConst.PLAYER_JOIN] || undefined;

      if (playJoin) {
        return await doRedirect("/question");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ Init Player Error", error);
      }
    } finally {
      dispatch(hideLoading());
    }
  };

  const onFinish: FormProps<IFormEnterName>["onFinish"] = async (values) => {
    try {
      dispatch(showLoading());

      const result: IHttpResponse | undefined = await PlayerModel.createPlayer(
        values.name?.trim() || ""
      );

      if (result?.status === ResponseStatusConst.FAIL) {
        await dispatch(hideLoading());
        dispatch(
          handlerNotificationError({
            isOpen: true,
            description: result?.message,
          })
        );

        return;
      }

      await setCookie(
        null,
        PlayerKeyConst.PLAYER_JOIN,
        CryptoEncrypt(result?.data),
        {
          maxAge: 60 * 60,
        }
      );

      await setTimeout(async () => {
        await doRedirect("/question");
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ From Question Start Player Error", error);
      }
    }
  };

  const onFinishFailed: FormProps<IFormEnterName>["onFinishFailed"] = (
    errorInfo
  ) => {
    const listErrorField = errorInfo.errorFields;

    listErrorField.forEach((item) => {
      item.errors.forEach((error: string) => {
        dispatch(
          handlerNotificationError({
            isOpen: true,
            description: error,
          })
        );
      });
    });
  };

  return (
    <div className="questions-start-player">
      <Space direction="vertical" size={30} style={{ width: "100%" }}>
        <Card bordered={false}>
          <Form
            name="formEnterName"
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item<IFormEnterName>
              name="name"
              rules={[{ required: true, message: "Please input your name" }]}
            >
              <Input placeholder="Enter Your Name" />
            </Form.Item>

            <Button htmlType="submit" type="primary" block danger>
              Enter
            </Button>
          </Form>
        </Card>

        <div className="-actions">
          <Link href="/leader-board">
            <Button type="primary">View Leader Board</Button>
          </Link>
        </div>
      </Space>
    </div>
  );
};

export default QuestionStartPlayer;
