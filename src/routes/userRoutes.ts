import express from "express";
import {
  authMiddleware,
  validateUserCreation,
} from "../middlewares/userMiddlewares.ts";
import { createUser, getMe, loginUser, logoutController, refreshToken, getUserById,getAllUsersController, createHotelBookingController, getUserHotelBookingsController  } from "../controllers/userController.ts";

const router = express.Router();

router.post("/create", validateUserCreation, createUser);
router.post("/login", validateUserCreation, loginUser);
router.get("/me", authMiddleware, getMe);
router.post("/refresh", refreshToken);
router.post('/logout', logoutController);

router.get('/details', authMiddleware, getUserById);
router.get('/all', getAllUsersController);

// Hotel Booking routes
router.post('/hotel-bookings', authMiddleware, createHotelBookingController);
router.get('/hotel-bookings', authMiddleware, getUserHotelBookingsController);
// router.get('/hotel-bookings', authMiddleware, getUserHotelBookingsController);
// router.get('/hotel-bookings/:bookingId', authMiddleware, getHotelBookingByIdController);
// router.put('/hotel-bookings/:bookingId/status', authMiddleware, updateHotelBookingStatusController);
// router.delete('/hotel-bookings/:bookingId', authMiddleware, cancelHotelBookingController);
export default router;
