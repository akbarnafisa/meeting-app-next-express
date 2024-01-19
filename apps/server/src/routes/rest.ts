import express from "express";
import { rtcController } from "../controller/rtc";

const router = express.Router();

router.get("/rtc/room/:id", rtcController);
router.get("/health", (_, res, next) => {
  try {
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
