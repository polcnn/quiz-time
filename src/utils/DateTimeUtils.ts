import moment from "moment";
import "moment/locale/th";

import { FormatDateTimeConst } from "../constants/AppConstants";

export const CurrentDateTime = (
  format: string = FormatDateTimeConst.FULLDATETIME
): string => {
  return moment().format(format);
};
