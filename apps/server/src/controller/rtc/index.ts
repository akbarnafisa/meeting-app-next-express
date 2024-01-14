import { RequestHandler } from "express";
import { rtcService } from "../../service/rtc";

export const rtcController: RequestHandler = async (req, res, next) => {
  try {
    const data = await rtcService(req);
    res.status(200).json({
      error: null,
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
