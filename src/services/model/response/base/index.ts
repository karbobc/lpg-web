export interface ApiResult {
  code: string;
  success: boolean;
  message: string;
  requestId?: string;
  data?: unknown;
}

export const Rc = {
  OK: "200",
  ABORT: "500",
};
