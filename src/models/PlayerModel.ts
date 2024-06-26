import LocalStorageModel from "@/models/LocalStorageModel";

import type { IHttpResponse } from "@/types/http";
import type { IPlayer, IPlayerQuestion } from "@/types/question";
import type { ITriviaQuestion } from "@/types/trivia";

import { LogResponse } from "@/utils/LogUtil";

import { ResponseStatusConst } from "@/constants/AppConstants";
import { PlayerKeyConst } from "@/constants/QuestionConstants";

import { SuccessResponse, ErrorResponse } from "@/utils/ResponseUtil";

export default class PlayerModel {
  static async getListPlayer() {
    try {
      const result: IPlayer[] | undefined = await LocalStorageModel.get(
        PlayerKeyConst.LIST_PLAYER
      );

      return SuccessResponse(result || [], "Get List Player Success");
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ Get List Player Error", error);
        return ErrorResponse(error.message);
      }
    }
  }

  static async getPlayer(id: number) {
    try {
      const getListPlayer: IHttpResponse<IPlayer[]> | undefined =
        await this.getListPlayer();

      if (getListPlayer?.status === ResponseStatusConst.SUCCESS) {
        const listPlayer: IPlayer[] = getListPlayer?.data || [];

        const getPlayer = listPlayer.find((item: IPlayer) => item.id === id);

        if (!getPlayer) {
          return ErrorResponse("Player not found");
        }

        return SuccessResponse(getPlayer, "Get Player Successfully");
      }

      return ErrorResponse(getListPlayer?.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ Get Player Error", error);
        return ErrorResponse(error.message);
      }
    }
  }

  static async createPlayer(name: string) {
    try {
      if (!name) {
        return ErrorResponse("Please fill out the information completely");
      }

      const newPlayer: IPlayer = {
        id: 0,
        name,
        questions: [],
      };

      const getListPlayer: IHttpResponse<IPlayer[]> | undefined =
        await this.getListPlayer();

      if (getListPlayer?.status === ResponseStatusConst.SUCCESS) {
        const listPlayer: IPlayer[] = getListPlayer?.data || [];

        const havePlayer = listPlayer.find(
          (item: IPlayer) => item.name === name
        );

        if (havePlayer) {
          return SuccessResponse(
            {
              id: havePlayer.id,
              name: havePlayer.name,
            },
            "Create Player Successfully"
          );
        }

        const getLastId: number = listPlayer.length
          ? listPlayer[listPlayer.length - 1].id
          : 0;
        newPlayer.id = getLastId + 1;

        await LocalStorageModel.set(PlayerKeyConst.LIST_PLAYER, [
          ...listPlayer,
          newPlayer,
        ]);

        return SuccessResponse(
          {
            id: newPlayer.id,
            name: newPlayer.name,
          },
          "Create Player Successfully"
        );
      }

      return ErrorResponse(getListPlayer?.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ Create Player Error", error);
        return ErrorResponse(error.message);
      }
    }
  }

  static async updateQuestionPlayer(
    id: number,
    listQuestion: ITriviaQuestion[]
  ) {
    try {
      const getListPlayer: IHttpResponse<IPlayer[]> | undefined =
        await this.getListPlayer();

      if (getListPlayer?.status === ResponseStatusConst.SUCCESS) {
        const listPlayer: IPlayer[] = getListPlayer?.data || [];
        const playerIndex: number = listPlayer.findIndex(
          (item: IPlayer) => item.id === id
        );

        if (playerIndex === -1) return ErrorResponse("Player not found");

        const getPlayer: IPlayer = listPlayer[playerIndex];
        const questionsPlayer = getPlayer.questions;

        const correctAnswersCount: number = listQuestion.reduce(
          (count: number, result: ITriviaQuestion) => {
            return count + (result.isCorrect ? 1 : 0);
          },
          0
        );

        const newQuestion: IPlayerQuestion = {
          name: `Question ${questionsPlayer.length + 1}`,
          list: listQuestion,
          score: {
            current: correctAnswersCount,
            max: listQuestion.length,
          },
        };

        getPlayer.questions = [...questionsPlayer, newQuestion];
        listPlayer[playerIndex] = getPlayer;

        await LocalStorageModel.set(PlayerKeyConst.LIST_PLAYER, listPlayer);

        return SuccessResponse(
          getPlayer,
          "Update Question Player Successfully"
        );
      }

      return ErrorResponse(getListPlayer?.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse("❗️ Update Question Player Error", error);
        return ErrorResponse(error.message);
      }
    }
  }
}
