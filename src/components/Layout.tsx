import { Space } from "antd";

import { config } from "@/config";

import Logo from "@/components/Logo";
import Loader from "@/components/Loader";
import NotificationSuccess from "@/components/Notication/NotificationSuccess";
import NotificationError from "@/components/Notication/NotificationError";

interface IProps {
  children: JSX.Element | JSX.Element[];
}

const Layout = ({ children }: IProps) => {
  return (
    <div className="x-layout">
      <Space direction="vertical" size={30} style={{ width: "100%" }}>
        <Loader />

        <Logo title={config.meta.title} />

        {children}

        <NotificationSuccess />
        <NotificationError />
      </Space>
    </div>
  );
};

export default Layout;
