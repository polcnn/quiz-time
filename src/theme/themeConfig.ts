import type { ThemeConfig } from "antd";

import form from "./components/form";
import button from "./components/button";
import modal from "./components/modal";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    borderRadius: 7,
  },
  components: {
    Form: form,
    Button: button,
    Modal: modal,
  },
};

export default theme;
