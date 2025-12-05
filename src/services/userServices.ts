import userModel from "../models/userModel.ts";

export function insertUserServices(newUser: {
  email: string;
  name: string;
  userType: string;
  password: string;
}) {
  return userModel.create(newUser)
}

export function findUser(email: string) {
  return userModel.findOne({email: email})
}

export function findUserById(id:string){
  return userModel.findById(id)
}

export const logoutService = async (refreshToken: string): Promise<boolean> => {
  try {
    const user = await userModel.findOneAndUpdate(
      { refreshToken: refreshToken },
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    return !!user;
  } catch (error) {
    console.error("Logout service error:", error);
    throw new Error("Database error during logout");
  }
};

export function getAllUsers() {
  return userModel.find({}, { password: 0, refreshToken: 0 }).lean();
}

export const deleteUserService = async (userId: string) => {
  try {
    // Check if user exists
    const userToDelete = await userModel.findById(userId);
    
    if (!userToDelete) {
      return {
        success: false,
        message: "User not found",
        statusCode: 404
      };
    }

    // Delete the user
    await userModel.findByIdAndDelete(userId);

    return {
      success: true,
      message: "User deleted successfully"
    };

  } catch (error: any) {
    console.error("Error in deleteUserService:", error);
    
    return {
      success: false,
      message: error.message || "Failed to delete user",
      statusCode: 500
    };
  }
};

export const createHotelBookingService = async (userId: string, bookingData: any) => {
  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const newHotelBooking = {
      name: bookingData.name,
      phoneNumber: bookingData.phoneNumber,
      address: bookingData.address,
      checkInDate: new Date(bookingData.dateRange.startDate),
      checkOutDate: new Date(bookingData.dateRange.endDate),
      nightCount: bookingData.nightCount,
      totalPrice: bookingData.totalPrice,
      roomReference: bookingData.roomReference,
      hotelReference: bookingData.hotelReference,
      image: bookingData.image,
      dateBooked: new Date(),
      status: 'upcoming' as const
    };

    user.hotelBookings.push(newHotelBooking);
    const updatedUser = await user.save();
    
    return updatedUser.hotelBookings[updatedUser.hotelBookings.length - 1];
  } catch (error) {
    throw new Error(`Failed to create hotel booking: ${error}`);
  }
};

export const getUserHotelBookingsService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select('hotelBookings');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user.hotelBookings;
  } catch (error) {
    throw new Error(`Failed to fetch hotel bookings: ${error}`);
  }
};