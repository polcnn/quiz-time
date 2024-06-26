export interface IHttpResponse<T = any | any[] | undefined> {
  status: "SUCCESS" | "FAIL" | string;
  message: string;
  data?: T;
}
