"use client";

import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";

import { createCache, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";

import { ConfigProvider, App } from "antd";
import type { Locale } from "antd/lib/locale";

import thTH from "antd/locale/th_TH";
import enUS from "antd/locale/en_US";

import theme from "@/theme/themeConfig";

import { useSelector } from "@/stores/Store";
import type { AppState } from "@/stores/Store";

import { LanguageConst } from "@/constants/LocaleConstants";

interface IProps {
  children: ReactNode;
}

const AntdProvider = ({ children }: IProps) => {
  const [lang, setLang] = useState<Locale | undefined>(undefined);

  const cache = useMemo<Entity>(() => createCache(), []);

  const { language } = useSelector((state: AppState) => state.CommonReducer);

  useEffect(() => {
    if (language === LanguageConst.TH) {
      setLang(thTH);
    } else if (language === LanguageConst.EN) {
      setLang(enUS);
    }
  }, [language]);

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider theme={theme} locale={lang}>
        <App>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default AntdProvider;
