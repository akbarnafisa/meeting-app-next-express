import type { ErrorRequestHandler } from "express";

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
};
