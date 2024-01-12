import express from "express";
import { registerController, loginController } from "../controller/users";
import { getTagsController } from "../controller/tags";

const router = express.Router();
router.post("/api/users", registerController);
router.post("/api/users/login", loginController);
router.get("/api/tags", getTagsController);

export default router;
