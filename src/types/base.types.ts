export const JsendStatus = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
} as const;

export interface JsendReturnType<P, M = undefined> {
  payload: P;
  meta?: M;
}
