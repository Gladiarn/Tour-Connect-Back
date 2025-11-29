import express from "express";
import {
  authMiddleware,
  validateUserCreation,
} from "../middlewares/userMiddlewares.ts";
import { createUser, getMe, loginUser, refreshToken } from "../controllers/userController.ts";

const router = express.Router();

router.post("/create", validateUserCreation, createUser);
router.post("/login", validateUserCreation, loginUser);
router.get("/me", authMiddleware, getMe);
router.post("/refresh", refreshToken);

export default router;
