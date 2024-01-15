import { CylinderSearchParam } from "@/services/model/request/cylinder";
import { ApiResult } from "@/services/model/response/base";
import { CylinderSearchVO } from "@/services/model/response/cylinder";
import request from "@/services/request.ts";

export const search = async (param: CylinderSearchParam) => {
  const response: ApiResult = await request({
    url: "/cylinder/s",
    method: "GET",
    params: param,
  });
  return response?.data as Promise<Array<CylinderSearchVO>>;
};
