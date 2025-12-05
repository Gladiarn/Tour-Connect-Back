import express from "express";
import {
  authMiddleware,
  validateUserCreation,
} from "../middlewares/userMiddlewares.ts";
import {
  createUser,
  getMe,
  loginUser,
  logoutController,
  refreshToken,
  getUserById,
  getAllUsersController,
  createHotelBookingController,
  getUserHotelBookingsController,
  deleteUserController, // Add this import
} from "../controllers/userController.ts";

const router = express.Router();

router.post("/create", validateUserCreation, createUser);
router.post("/login", validateUserCreation, loginUser);
router.get("/me", authMiddleware, getMe);
router.post("/refresh", refreshToken);
router.post("/logout", logoutController);

router.get("/details", authMiddleware, getUserById);
router.get("/all", getAllUsersController);
router.delete("/:id", authMiddleware, deleteUserController); // Add this route

// Hotel Booking routes
router.post("/hotel-bookings", authMiddleware, createHotelBookingController);
router.get("/hotel-bookings", authMiddleware, getUserHotelBookingsController);

export default router;