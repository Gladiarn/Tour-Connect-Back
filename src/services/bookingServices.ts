import userModel from '../models/userModel.ts';

// Create a booking
export const createBookingService = async (userId: string, bookingData: any) => {
  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const newBooking = {
      destinationReference: bookingData.destinationReference,
      tourType: bookingData.tourType,
      transportation: bookingData.transportation || [],
      image: bookingData.image,
      dateBooked: new Date(),
      dateStart: new Date(bookingData.dateStart),
      totalPrice: bookingData.totalPrice,
      status: 'upcoming'
    };

    user.bookings.push(newBooking);
    const updatedUser = await user.save();
    
    return updatedUser.bookings[updatedUser.bookings.length - 1];
  } catch (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }
};

// Get user's ongoing bookings (upcoming + ongoing)
export const getOngoingBookingsService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select('bookings');
    
    if (!user) {
      throw new Error('User not found');
    }

    const ongoingBookings = user.bookings.filter(booking => 
      booking.status === 'upcoming' || booking.status === 'ongoing'
    );
    
    return ongoingBookings;
  } catch (error) {
    throw new Error(`Failed to fetch ongoing bookings: ${error.message}`);
  }
};

// Get user's past bookings (completed + cancelled)
export const getPastBookingsService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select('bookings');
    
    if (!user) {
      throw new Error('User not found');
    }

    const pastBookings = user.bookings.filter(booking => 
      booking.status === 'completed' || booking.status === 'cancelled'
    );
    
    return pastBookings;
  } catch (error) {
    throw new Error(`Failed to fetch past bookings: ${error.message}`);
  }
};

// Get all user bookings
export const getUserBookingsService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select('bookings');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user.bookings;
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
};

// Get user favorites
export const getUserFavoritesService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select('favorites');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user.favorites;
  } catch (error) {
    throw new Error(`Failed to fetch favorites: ${error.message}`);
  }
};

// Add to favorites
export const addToFavoritesService = async (userId: string, destinationId: string) => {
  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check if already in favorites
    if (user.favorites.includes(destinationId)) {
      throw new Error('Destination already in favorites');
    }

    user.favorites.push(destinationId);
    await user.save();
    
    return user.favorites;
  } catch (error) {
    throw new Error(`Failed to add to favorites: ${error.message}`);
  }
};

// Remove from favorites
export const removeFromFavoritesService = async (userId: string, destinationId: string) => {
  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Remove from favorites array
    user.favorites = user.favorites.filter(fav => fav.toString() !== destinationId);
    await user.save();
    
    return user.favorites;
  } catch (error) {
    throw new Error(`Failed to remove from favorites: ${error.message}`);
  }
};

// Get booking by ID
export const getBookingByIdService = async (userId: string, bookingId: string) => {
  try {
    const user = await userModel.findById(userId).select('bookings');
    
    if (!user) {
      throw new Error('User not found');
    }

    const booking = user.bookings.id(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  } catch (error) {
    throw new Error(`Failed to fetch booking: ${error.message}`);
  }
};

// Update booking status
export const updateBookingStatusService = async (userId: string, bookingId: string, status: string) => {
  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const booking = user.bookings.id(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = status;
    await user.save();
    
    return booking;
  } catch (error) {
    throw new Error(`Failed to update booking: ${error.message}`);
  }
};

// Cancel booking
export const cancelBookingService = async (userId: string, bookingId: string) => {
  return await updateBookingStatusService(userId, bookingId, 'cancelled');
};