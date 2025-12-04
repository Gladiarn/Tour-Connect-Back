import userModel from "../models/userModel.ts";
import destinationModel from "../models/destinationModel.ts";
// Create a booking
export const createBookingService = async (
  userId: string,
  bookingData: any
) => {
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const newBooking = {
      destinationReference: bookingData.destinationReference,
      tourType: bookingData.tourType,
      transportation: bookingData.transportation || [],
      image: bookingData.image,
      dateBooked: new Date(),
      dateStart: new Date(bookingData.dateStart),
      totalPrice: bookingData.totalPrice,
      status: "upcoming",
    };

    user.bookings.push(newBooking);
    const updatedUser = await user.save();

    return updatedUser.bookings[updatedUser.bookings.length - 1];
  } catch (error) {
    throw new Error(`Failed to create booking: ${error}`);
  }
};

// Get user's ongoing bookings (upcoming + ongoing)
export const getOngoingBookingsService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select("bookings");

    if (!user) {
      throw new Error("User not found");
    }

    const ongoingBookings = user.bookings.filter(
      (booking) => booking.status === "upcoming" || booking.status === "ongoing"
    );

    return ongoingBookings;
  } catch (error) {
    throw new Error(`Failed to fetch ongoing bookings: ${error}`);
  }
};

// Get user's past bookings (completed + cancelled)
export const getPastBookingsService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select("bookings");

    if (!user) {
      throw new Error("User not found");
    }

    const pastBookings = user.bookings.filter(
      (booking) =>
        booking.status === "completed" || booking.status === "cancelled"
    );

    return pastBookings;
  } catch (error) {
    throw new Error(`Failed to fetch past bookings: ${error}`);
  }
};

// Get all user bookings
export const getUserBookingsService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select("bookings");

    if (!user) {
      throw new Error("User not found");
    }

    return user.bookings;
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${error}`);
  }
};

// Get user favorites
export const getUserFavoritesService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select("favorites");

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.favorites || user.favorites.length === 0) {
      return [];
    }

    const favoriteDestinations = await destinationModel
      .find({
        reference: { $in: user.favorites },
      })
      .select(
        "name location images description budget rating activityType reference"
      );

    return favoriteDestinations;
  } catch (error) {
    throw new Error(`Failed to fetch favorites: ${error}`);
  }
};

// Add to favorites
export const addToFavoritesService = async (
  userId: string,
  reference: string
) => {
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if already in favorites
    if (user.favorites.includes(reference)) {
      throw new Error("Destination already in favorites");
    }

    user.favorites.push(reference);
    await user.save();

    return user.favorites;
  } catch (error) {
    throw new Error(`Failed to add to favorites: ${error}`);
  }
};

// Remove from favorites
export const removeFromFavoritesService = async (
  userId: string,
  destinationId: string
) => {
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Remove from favorites array
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== destinationId
    );
    await user.save();

    return user.favorites;
  } catch (error) {
    throw new Error(`Failed to remove from favorites: ${error}`);
  }
};

// Get booking by ID
export const getBookingByIdService = async (
  userId: string,
  bookingId: string
) => {
  try {
    const user = await userModel.findById(userId).select("bookings");

    if (!user) {
      throw new Error("User not found");
    }

    const booking = user.bookings.id(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    return booking;
  } catch (error) {
    throw new Error(`Failed to fetch booking: ${error}`);
  }
};

// Update booking status
export const updateBookingStatusService = async (
  userId: string,
  bookingId: string,
  status: string
) => {
  try {
    const user = await userModel.findById(userId);
    const validStatuses = [
      "upcoming",
      "ongoing",
      "completed",
      "cancelled",
    ] as const;
    type BookingStatus = (typeof validStatuses)[number];

    if (!user) {
      throw new Error("User not found");
    }

    const booking = user.bookings.id(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.status = status as BookingStatus;
    await user.save();

    return booking;
  } catch (error) {
    throw new Error(`Failed to update booking: ${error}`);
  }
};

// Cancel booking
export const cancelBookingService = async (
  userId: string,
  bookingId: string
) => {
  return await updateBookingStatusService(userId, bookingId, "cancelled");
};
