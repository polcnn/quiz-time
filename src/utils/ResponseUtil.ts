import { ResponseStatusConst } from "@/constants/AppConstants";

export const SuccessResponse = (
  data: any = undefined,
  message: string = "Successfully"
) => {
  if (data) {
    return { status: ResponseStatusConst.SUCCESS, message, data };
  }

  return { status: ResponseStatusConst.SUCCESS, message };
};

export const ErrorResponse = (
  message: string = "Failed",
  details: any = undefined
) => {
  return { status: ResponseStatusConst.FAIL, message, details };
};
