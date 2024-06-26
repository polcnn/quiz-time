"use client";

import { useState, useEffect } from "react";

import Link from "next/link";

import { Space, Card, Table, Button } from "antd";
import type { TableProps } from "antd";

import { useSelector, useDispatch } from "@/stores/Store";
import type { AppState } from "@/stores/Store";
import { showLoading, hideLoading } from "@/stores/reducers/LoaderReducer";
import { handlerNotificationError } from "@/stores/reducers/NotificationReducer";

import type { IHttpResponse } from "@/types/http";
import type {
  IPlayer,
  IPlayerQuestion,
  IPlayerLeaderboard,
} from "@/types/question";

import PlayerModel from "@/models/PlayerModel";

import { LogResponse } from "@/utils/LogUtil";

import { ResponseStatusConst } from "@/constants/AppConstants";

const QuestionLeaderBoard = () => {
  const [listPlayer, setListPlayer] = useState<IPlayerLeaderboard[]>([]);

  const dispatch = useDispatch();

  const { webStart } = useSelector((state: AppState) => state.CommonReducer);

  useEffect(() => {
    if (webStart) {
      initPlayer();
    }
  }, [webStart]);

  const initPlayer = async () => {
    try {
      dispatch(showLoading());

      const getListPlayer: IHttpResponse<IPlayer[]> | undefined =
        await PlayerModel.getListPlayer();

      if (getListPlayer?.status === ResponseStatusConst.FAIL) {
        dispatch(
          handlerNotificationError({
            isOpen: true,
            description: getListPlayer?.message,
          })
        );

        return;
      }

      const newListPlayer: IPlayerLeaderboard[] = [];

      getListPlayer?.data?.map((item: IPlayer) => {
        item.questions.map((question: IPlayerQuestion) => {
          newListPlayer.push({
            ...question,
            playerId: item.id,
            playerName: item.name,
          });
        });
      });

      setListPlayer(newListPlayer || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ Init Player Error", error);
      }
    } finally {
      dispatch(hideLoading());
    }
  };

  const renderScore = (data: IPlayerLeaderboard): JSX.Element => {
    const currentScore: number = data.score.current;
    const maxScore: number = data.score.max;

    let color: string = "";

    if (currentScore >= 0.7 * maxScore) {
      color = "text-green-500";
    } else if (
      currentScore >= 0.5 * maxScore &&
      currentScore < 0.7 * maxScore
    ) {
      color = "text-amber-500";
    } else {
      color = "text-red-500";
    }

    return (
      <Space>
        <div className={color}>{currentScore}</div>/<div>{maxScore}</div>
      </Space>
    );
  };

  const columns: TableProps<IPlayerLeaderboard>["columns"] = [
    {
      title: "Question Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Score",
      key: "score",
      render: (_, record) => renderScore(record),
    },
    {
      title: "Player Name",
      dataIndex: "playerName",
      key: "playerName",
    },
  ];

  return (
    <div className="questions-leader-board">
      <Space direction="vertical" size={30} style={{ width: "100%" }}>
        <Card bordered={false}>
          <Table rowKey="name" columns={columns} dataSource={listPlayer} />
        </Card>

        <div className="-actions">
          <Link href="/">
            <Button type="primary">Join Game</Button>
          </Link>
        </div>
      </Space>
    </div>
  );
};

export default QuestionLeaderBoard;
