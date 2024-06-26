import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import type { ITriviaQuestion } from "@/types/trivia";

import { StatusCodeConst } from "@/constants/HttpConstants";

import { httpGet } from "@/utils/HttpUtils";
import { CryptoEncrypt } from "@/utils/CryptoUtils";
import { SuccessResponse, ErrorResponse } from "@/utils/ResponseUtil";
import { LogResponse } from "@/utils/LogUtil";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit: string = searchParams.get("limit") || "20";

    const result: ITriviaQuestion[] = await httpGet(
      `https://the-trivia-api.com/api/questions?limit=${limit}`
    );

    return new NextResponse(
      JSON.stringify(SuccessResponse(CryptoEncrypt(result))),
      {
        status: StatusCodeConst.SUCCESS.OK,
      }
    );
  } catch (error: unknown) {
    LogResponse("❗️ Get Questions Error", error);

    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify(ErrorResponse("Get Questions Error", error.message)),
        {
          status: StatusCodeConst.ERROR.INTERNAL_SERVER_ERROR,
        }
      );
    }

    return new NextResponse(
      JSON.stringify(ErrorResponse("An unknown error occurred", error)),
      {
        status: StatusCodeConst.ERROR.INTERNAL_SERVER_ERROR,
      }
    );
  }
};
