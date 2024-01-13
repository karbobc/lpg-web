export interface ApiResult {
  code: string;
  success: boolean;
  message: string;
  data?: unknown;
  datetime?: string;
  timestamp?: string;
}

export const Rc = {
  OK: "200",
  ABORT: "500",
};
