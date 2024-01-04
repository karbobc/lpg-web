import { ApiResult, RC } from "@/services/model/base";
import { message as toast } from "antd";
import axios, { AxiosResponse } from "axios";

const client = axios.create({
  baseURL: "/api",
  timeout: 1 << 3,
});

// 请求拦截器
client.interceptors.request.use((request) => {
  return request;
});

// 响应拦截器
client.interceptors.response.use(
  async (response) => {
    console.log("响应拦截");
    console.log(response);
    console.log("\n");

    let result: ApiResult;
    // 处理文件流
    const contentType =
      response.headers["Content-Type"]?.toString() || response.headers["content-type"]?.toString() || "";
    if (contentType.includes("application/octet-stream")) {
      const filename = /filename=([^;]+)/.exec(response.headers["content-disposition"] || "")?.pop() || "";
      if (filename.length === 0) {
        result = {
          code: RC.ABORT,
          message: `文件名${filename}不合法`,
        };
        toast.error(result.message);
        return result as unknown as AxiosResponse<ApiResult>;
      }
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const url = window.URL || window.webkitURL;
      const downloadUrl = url.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      link.click();
      url.revokeObjectURL(downloadUrl);
      result = {
        code: RC.OK,
        message: "文件下载成功",
        data: blob,
      };
      return result as unknown as AxiosResponse<ApiResult>;
    }

    // 设置 responseType 为 blob 或 arraybuffer, 但是响应内容不是 application/octeet-stream
    if (response.request?.responseType === "blob" || response.request?.responseType === "arraybuffer") {
      const arrayBuffer = await new Blob([response.data], {
        type: "application/json",
      }).arrayBuffer();
      result = JSON.parse(new TextDecoder().decode(new Uint8Array(arrayBuffer)));
    } else {
      // 文本响应, 非文件流响应
      result = response.data;
    }
    // 处理 JSON 响应
    if (result.code !== RC.OK) {
      toast.error(result.message || "接口请求失败!!!");
    }
    return result as unknown as AxiosResponse<ApiResult>;
  },
  (error) => {
    toast.error(error.message || "接口请求失败!!!");
  },
);

export default client;
