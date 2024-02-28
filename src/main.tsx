import App from "@/components/App/index.tsx";
import "@/main.scss";
import { App as AntdApp } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AntdApp style={{ width: "100%" }}>
      <App />
    </AntdApp>
  </React.StrictMode>,
);
