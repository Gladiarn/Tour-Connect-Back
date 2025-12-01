import {
  createBookingService,
  getOngoingBookingsService,
  getPastBookingsService,
  getUserBookingsService,
  getUserFavoritesService,
  addToFavoritesService,
  removeFromFavoritesService,
  getBookingByIdService,
  updateBookingStatusService,
  cancelBookingService
} from '../services/bookingServices.ts';

// Create a booking
export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookingData = req.body;

    const booking = await createBookingService(userId, bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get ongoing bookings (upcoming + ongoing)
export const getOngoingBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await getOngoingBookingsService(userId);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get past bookings (completed + cancelled)
export const getPastBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await getPastBookingsService(userId);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all user bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await getUserBookingsService(userId);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user favorites
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await getUserFavoritesService(userId);

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add to favorites
export const addToFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reference } = req.body;

    if (!reference) {
      res.status(400).json({
        success: false,
        message: 'reference is required'
      });
      return;
    }

    const favorites = await addToFavoritesService(userId, reference);

    res.status(200).json({
      success: true,
      message: 'Added to favorites',
      data: favorites
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Remove from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { destinationId } = req.params;

    const favorites = await removeFromFavoritesService(userId, destinationId);

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
      data: favorites
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get single booking
export const getBookingById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookingId } = req.params;

    const booking = await getBookingByIdService(userId, bookingId);

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await updateBookingStatusService(userId, bookingId, status);

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookingId } = req.params;

    const booking = await cancelBookingService(userId, bookingId);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};