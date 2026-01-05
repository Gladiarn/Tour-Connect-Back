import express from 'express';
import {
BookingController
} from '../controllers/bookingController.ts';
import {authMiddleware } from '../middlewares/userMiddlewares.ts';

const bookingController = new BookingController();
const router = express.Router();

router.use(authMiddleware);

// Booking routes
router.post('/create', bookingController.createBooking);
router.get('/ongoing', bookingController.getOngoingBookings);
router.get('/past', bookingController.getPastBookings);
router.get('/all', bookingController.getUserBookings);
router.get('/:bookingId', bookingController.getBookingById);
router.put('/:bookingId/status', bookingController.updateBookingStatus);
router.delete('/:bookingId/cancel', bookingController.cancelBooking);

// Favorites routes
router.get('/favorites/all', bookingController.getUserFavorites);
router.post('/favorites/add', bookingController.addToFavorites);
router.delete('/favorites/remove/:destinationId', bookingController.removeFromFavorites);

export default router;