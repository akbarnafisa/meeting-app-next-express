import type { ErrorRequestHandler } from "express";
import { ResponseError } from "../utils/responseError";

export const errorMiddleware: ErrorRequestHandler = async (
  err,
  _,
  res,
  next
) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        success: false,
        data: null,
        error: {
          errorMsg: err.message,
          errorCode: err.errorCode,
        },
      })
      .end();
  } else {
    res
      .status(err.status || 500)
      .json({
        success: false,
        data: null,
        error: {
          errorMsg: err.message,
          errorCode: err.errorCode,
        },
      })
      .end();
  }
};
