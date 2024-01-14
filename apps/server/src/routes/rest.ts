import express from "express";
import { rtcController } from "../controller/rtc";


const router = express.Router();

router.get("/rtc/room/:id", rtcController);


export default router;
