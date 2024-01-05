export interface ApiResult {
  code: string;
  message: string;
  data?: unknown;
}

export const Rc = {
  OK: "200",
  ABORT: "500",
};
