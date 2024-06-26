"use client";

import { useState, useRef, useEffect } from "react";

import _ from "lodash";

import { parseCookies, destroyCookie } from "nookies";

import { Card, Flex, List, Avatar, Space, Radio, Divider, Button } from "antd";
import type { RadioChangeEvent } from "antd";

import { IconDoorExit } from "@tabler/icons-react";

import { doRedirect } from "@/app/actions";

import { useSelector, useDispatch } from "@/stores/Store";
import type { AppState } from "@/stores/Store";
import { showLoading, hideLoading } from "@/stores/reducers/LoaderReducer";
import {
  handlerNotificationSuccess,
  handlerNotificationError,
} from "@/stores/reducers/NotificationReducer";

import type { IHttpResponse } from "@/types/http";
import type { IPlayer } from "@/types/question";
import type { ITriviaQuestion } from "@/types/trivia";

import PlayerModel from "@/models/PlayerModel";

import { httpGet } from "@/utils/HttpUtils";
import { LogResponse } from "@/utils/LogUtil";
import { CryptoDecrypt } from "@/utils/CryptoUtils";

import { ResponseStatusConst } from "@/constants/AppConstants";
import { PlayerKeyConst } from "@/constants/QuestionConstants";

const ListAnswer = ({
  id,
  data,
  disabled = false,
  onChange,
}: {
  id: string;
  data: string[] | undefined;
  disabled: boolean;
  onChange: (id: string, answer: string) => void;
}) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  const doSelect = async (e: RadioChangeEvent) => {
    const newValue: string = e.target.value as string;

    await setValue(newValue);
    onChange(id, newValue);
  };

  return (
    <Radio.Group onChange={doSelect} value={value}>
      <Space direction="vertical">
        {data?.map((answer: string, index: number) => (
          <Radio key={`${id}-${index}`} value={answer} disabled={disabled}>
            {answer}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
};

const QuestionPlaying = () => {
  const [player, setPlayer] = useState<IPlayer | undefined>(undefined);
  const [listQuestion, setListQuestion] = useState<ITriviaQuestion[]>([]);
  const [isProcess, setIsProcess] = useState<boolean>(false);

  const listResultAnswer = useRef<any | undefined>(undefined);

  const dispatch = useDispatch();
  const cookies = parseCookies();

  const { webStart } = useSelector((state: AppState) => state.CommonReducer);

  useEffect(() => {
    if (webStart) {
      initPlayer();
    }
  }, [webStart]);

  useEffect(() => {
    if (listQuestion.length > 0) {
      const newListResultAnswer: any = {};

      listQuestion.forEach((item: ITriviaQuestion) => {
        if (!newListResultAnswer[item.id]) {
          newListResultAnswer[item.id] = "";
        }
      });

      listResultAnswer.current = newListResultAnswer;
    }
  }, [listQuestion]);

  const initPlayer = async () => {
    try {
      dispatch(showLoading());

      const playJoin: string | undefined =
        cookies?.[PlayerKeyConst.PLAYER_JOIN] || undefined;

      if (playJoin) {
        const playerInfo: IPlayer = await CryptoDecrypt(playJoin);

        const checkPlayer: IHttpResponse | undefined =
          await PlayerModel.getPlayer(playerInfo.id);

        if (checkPlayer?.status === ResponseStatusConst.FAIL) {
          await destroyCookie(null, PlayerKeyConst.PLAYER_JOIN);
          return doRedirect("/");
        }

        await setPlayer(checkPlayer?.data);
        await initQuestion();
      } else {
        await doRedirect("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ Init Player Error", error);
      }
    } finally {
      dispatch(hideLoading());
    }
  };

  const initQuestion = async () => {
    try {
      dispatch(showLoading());

      const result: IHttpResponse<ITriviaQuestion[]> = await httpGet(
        "/api/questions?limit=20"
      );

      if (result.status === ResponseStatusConst.FAIL) {
        dispatch(
          handlerNotificationError({
            isOpen: true,
            description: result.message,
          })
        );

        return;
      }

      const questions: ITriviaQuestion[] = CryptoDecrypt(result?.data) || [];

      setListQuestion([
        ...(questions?.map((item: ITriviaQuestion) => {
          const shuffledQuestions = _.shuffle([
            item.correctAnswer,
            ...item.incorrectAnswers,
          ]);

          return { ...item, shuffledQuestions };
        }) || []),
      ]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ Init Question Error", error);
      }
    } finally {
      dispatch(hideLoading());
    }
  };

  const doChooseAnswer = (id: string, answer: string) => {
    listResultAnswer.current = { ...listResultAnswer.current, [id]: answer };
  };

  const checkAnswers = (answers: any): ITriviaQuestion[] => {
    return listQuestion.map((question: ITriviaQuestion) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;

      return {
        ...question,
        userAnswer,
        isCorrect,
      };
    });
  };

  const doSubmit = async () => {
    try {
      setIsProcess(true);

      const listBlankAnswer = await Object.entries(
        listResultAnswer.current
      ).filter(([_, value]) => !value);

      if (listBlankAnswer.length) {
        dispatch(
          handlerNotificationError({
            isOpen: true,
            description: "Please answer the questions completely",
          })
        );

        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const resultAnswers: ITriviaQuestion[] = await checkAnswers(
        listResultAnswer.current
      );

      const result: IHttpResponse | undefined =
        await PlayerModel.updateQuestionPlayer(player?.id!, resultAnswers);

      if (result?.status === ResponseStatusConst.FAIL) {
        dispatch(
          handlerNotificationError({
            isOpen: true,
            description: result?.message,
          })
        );

        return;
      }

      await destroyCookie(null, PlayerKeyConst.PLAYER_JOIN);
      await doRedirect("/leader-board");

      dispatch(
        handlerNotificationSuccess({
          isOpen: true,
          description: "Thank you for playing the game this time",
        })
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ Submit Answer Question Error", error);
      }
    } finally {
      setIsProcess(false);
    }
  };

  const doLeave = async () => {
    await dispatch(showLoading());
    await destroyCookie(null, PlayerKeyConst.PLAYER_JOIN);
    await doRedirect("/");
  };

  return (
    <div className="questions-playing">
      <Card
        title={
          player?.questions ? (
            <Flex align="center" justify="space-between">
              <div>Question {player?.questions.length + 1}</div>

              <Button
                type="primary"
                icon={<IconDoorExit size={18} />}
                danger
                onClick={() => doLeave()}
              >
                Leave
              </Button>
            </Flex>
          ) : null
        }
        bordered={false}
      >
        <List
          itemLayout="horizontal"
          dataSource={listQuestion}
          renderItem={(item: ITriviaQuestion, index: number) => {
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={
                    <div dangerouslySetInnerHTML={{ __html: item.question }} />
                  }
                  description={
                    <ListAnswer
                      id={item.id}
                      data={item.shuffledQuestions}
                      disabled={isProcess}
                      onChange={doChooseAnswer}
                    />
                  }
                />
              </List.Item>
            );
          }}
        />

        <Divider />

        <div className="-actions">
          <Button
            type="primary"
            size="large"
            loading={isProcess}
            disabled={isProcess}
            onClick={() => doSubmit()}
          >
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuestionPlaying;
