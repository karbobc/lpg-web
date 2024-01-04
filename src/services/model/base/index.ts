export interface ApiResult {
  code: string;
  message: string;
  data?: unknown;
}

export const RC = {
  OK: "200",
  ABORT: "500",
};
