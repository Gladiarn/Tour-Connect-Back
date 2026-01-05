import userModel from "../models/userModel.ts";
import destinationModel from "../models/destinationModel.ts";

// Define types
type BookingStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface BookingData {
  destinationReference: string;
  tourType: string;
  transportation?: string[];
  image: string;
  dateStart: string;
  totalPrice: number;
}

export class BookingService {
  // Create a booking
  async createBooking(userId: string, bookingData: BookingData) {
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
        status: "upcoming" as BookingStatus,
      };

      user.bookings.push(newBooking);
      const updatedUser = await user.save();

      return updatedUser.bookings[updatedUser.bookings.length - 1];
    } catch (error) {
      throw new Error(`Failed to create booking: ${error}`);
    }
  }

  // Get user's ongoing bookings (upcoming + ongoing)
  async getOngoingBookings(userId: string) {
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
  }

  // Get user's past bookings (completed + cancelled)
  async getPastBookings(userId: string) {
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
  }

  // Get all user bookings
  async getUserBookings(userId: string) {
    try {
      const user = await userModel.findById(userId).select("bookings");

      if (!user) {
        throw new Error("User not found");
      }

      return user.bookings;
    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${error}`);
    }
  }

  // Get user favorites
  async getUserFavorites(userId: string) {
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
  }

  // Add to favorites
  async addToFavorites(userId: string, reference: string) {
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
  }

  // Remove from favorites
  async removeFromFavorites(userId: string, destinationId: string) {
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
  }

  // Get booking by ID
  async getBookingById(userId: string, bookingId: string) {
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
  }

  // Update booking status
  async updateBookingStatus(userId: string, bookingId: string, status: BookingStatus) {
    try {
      const user = await userModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const booking = user.bookings.id(bookingId);

      if (!booking) {
        throw new Error("Booking not found");
      }

      booking.status = status;
      await user.save();

      return booking;
    } catch (error) {
      throw new Error(`Failed to update booking: ${error}`);
    }
  }

  // Cancel booking
  async cancelBooking(userId: string, bookingId: string) {
    return await this.updateBookingStatus(userId, bookingId, "cancelled");
  }
}