import type { Viewport } from "next";

import type { IConfig } from "@/types/config";

export const config: IConfig = {
  endpoints: {
    baseUrl: process.env.BASE_URL!,
  },
  meta: {
    title: process.env.TITLE!,
  },
  isProduction: process.env.NODE_ENV === "production",
};

export const defaultViewPort: Viewport = {
  maximumScale: 1.0,
  userScalable: false,
};
