import express from 'express';
import {
  createBooking,
  getOngoingBookings,
  getPastBookings,
  getUserBookings,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.ts';
import {authMiddleware } from '../middlewares/userMiddlewares.ts';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Booking routes
router.post('/create', createBooking);
router.get('/ongoing', getOngoingBookings);
router.get('/past', getPastBookings);
router.get('/all', getUserBookings);
router.get('/:bookingId', getBookingById);
router.put('/:bookingId/status', updateBookingStatus);
router.delete('/:bookingId/cancel', cancelBooking);

// Favorites routes
router.get('/favorites/all', getUserFavorites);
router.post('/favorites/add', addToFavorites);
router.delete('/favorites/remove/:destinationId', removeFromFavorites);

export default router;