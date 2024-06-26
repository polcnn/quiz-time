import { LogResponse } from "@/utils/LogUtil";

export default class LocalStorageModel {
  static get(key: string) {
    try {
      const result = localStorage.getItem(key);

      if (result) {
        return JSON.parse(result);
      }

      return undefined;
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse(`❗️ Local Storage Get Key ${key} Error`, error);
        throw new Error(error.message);
      }
    }
  }

  static set(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse(`❗️ Local Storage Set Key ${key} Error`, error);
        throw new Error(error.message);
      }
    }
  }

  static del(key: string) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogResponse(`❗️ Local Storage Delete Key "${key}" Error`, error);
        throw new Error(error.message);
      }
    }
  }
}
