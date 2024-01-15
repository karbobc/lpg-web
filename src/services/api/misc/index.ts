import { EnrollParam } from "@/services/model/request/misc";
import { ApiResult } from "@/services/model/response/base";
import request from "@/services/request.ts";

export const enroll = async (param: EnrollParam) => {
  const response = await request({
    url: "/misc/enroll",
    method: "POST",
    data: param,
  });
  return response as unknown as Promise<ApiResult>;
};
