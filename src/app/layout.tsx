import type { Metadata, Viewport } from "next";

import { Prompt } from "next/font/google";

import "@/styles/globals.scss";
import "@/styles/layout.scss";

import ReduxProvider from "@/stores/ReduxProvider";
import AntdProvider from "~/lib/AntdProvider";

import Layout from "@/components/Layout";

import { config, defaultViewPort } from "@/config";

const prompt = Prompt({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-prompt",
});

export const viewport: Viewport = {
  ...defaultViewPort,
};

export const metadata: Metadata = {
  title: config.meta.title,
  description: config.meta.title,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: JSX.Element | JSX.Element[];
}>) => {
  return (
    <html lang="en">
      <body className={`${prompt.className} ${prompt.variable}`}>
        <ReduxProvider>
          <AntdProvider>
            <Layout>{children}</Layout>
          </AntdProvider>
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;
