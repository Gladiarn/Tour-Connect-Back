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

export const editUserService = async (
  id: string,
  updateData: {
    name: string;
    email: string;
    userType: string;
    password?: string;
  }
) => {
  try {

    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (updateData.email !== user.email) {
      const existingUser = await userModel.findOne({ email: updateData.email });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return updatedUser;
  } catch (error: any) {
    console.error("Error in editUserService:", error);
    throw error;
  }
};

export const createPackageBookingService = async (userId: string, bookingData: any) => {
  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }


    const newPackageBooking = {
      packageReference: bookingData.packageReference,
      image: bookingData.image,
      dateBooked: new Date(), 
      dateStart: new Date(bookingData.dateStart),
      totalPrice: bookingData.totalPrice,
      status: 'upcoming' as const,

      ...(bookingData.packageDetails && {
        packageDetails: {
          name: bookingData.packageDetails.name,
          location: bookingData.packageDetails.location,
          duration: bookingData.packageDetails.duration,
          packsize: bookingData.packageDetails.packsize,
          price: bookingData.packageDetails.price,
          pricePerHead: bookingData.packageDetails.pricePerHead,
          inclusions: bookingData.packageDetails.inclusions || [],
          description: bookingData.packageDetails.description,
        }
      })
    };

    user.packageBookings.push(newPackageBooking);
    const updatedUser = await user.save();
    
    return updatedUser.packageBookings[updatedUser.packageBookings.length - 1];
  } catch (error) {
    console.error("Create package booking service error:", error);
    throw new Error(`Failed to create package booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getUserPackageBookingsService = async (userId: string) => {
  try {
    const user = await userModel.findById(userId).select('packageBookings');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user.packageBookings.sort((a: any, b: any) => 
      new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime()
    );
  } catch (error) {
    console.error("Get package bookings service error:", error);
    throw new Error(`Failed to fetch package bookings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};