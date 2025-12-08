import express from "express";
import bcrypt from "bcryptjs";
import {
  findUser,
  findUserById,
  insertUserServices,
  logoutService,
  getAllUsers,
  createHotelBookingService,
  getUserHotelBookingsService,
  deleteUserService,
  editUserService,
  getUserPackageBookingsService,
  createPackageBookingService,
} from "../services/userServices.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.ts";

export async function createUser(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const { email, name, userType, password } = req.body;

    const existingUser = await findUser(email);
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await insertUserServices({
      email: email,
      name: name,
      userType: userType,
      password: hashedPassword,
    });

    if (!createdUser) {
      res.status(400).json({ message: "User not created" });
      return;
    }

    res.status(201).json({ message: "created Successfully: ", createdUser });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const { email, password } = req.body;

    const foundUser = await findUser(email);
    if (!foundUser) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const tokenPayload = {
      _id: foundUser._id.toString(),
      email: foundUser.email,
      name: foundUser.name,
      userType: foundUser.userType,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    const { password: _, ...userWithoutPassword } = foundUser.toObject();

    res.status(200).json({
      message: "Login Successfully",
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMe(req: express.Request, res: express.Response) {
  try {
    const user = await findUserById((req as any).user._id);

    if (!user) return res.status(404).json({ message: "user not found" });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function refreshToken(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token required" });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const user = await findUserById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const tokenPayload = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      userType: user.userType,
    };

    // Generate new access token
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const logoutController = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    const isLoggedOut = await logoutService(refreshToken);

    if (!isLoggedOut) {
      res
        .status(404)
        .json({ message: "Token not found or already invalidated" });
      return;
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout controller error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function getUserById(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const userId = (req as any).user._id;

    const user = await findUserById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const {
      password: _,
      refreshToken: __,
      ...userWithoutSensitiveData
    } = user.toObject();

    res.status(200).json({
      success: true,
      data: userWithoutSensitiveData,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllUsersController(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deleteUserController(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const userIdToDelete = req.params.id;
    const currentUserId = (req as any).user._id;
    const currentUserType = (req as any).user.userType;

    // Check if current user is admin
    if (currentUserType !== "admin") {
      res.status(403).json({
        success: false,
        message: "Unauthorized: Only admins can delete users",
      });
      return;
    }

    // Prevent admin from deleting themselves
    if (userIdToDelete === currentUserId.toString()) {
      res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
      return;
    }

    // Delete the user
    const result = await deleteUserService(userIdToDelete);

    if (!result.success) {
      res.status(result.statusCode || 400).json({
        success: false,
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const createHotelBookingController = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const bookingData = req.body;

    // Validate required fields
    const requiredFields = [
      "name",
      "phoneNumber",
      "address",
      "dateRange",
      "nightCount",
      "totalPrice",
      "roomReference",
      "hotelReference",
    ];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
        return;
      }
    }

    // Validate dateRange structure
    if (!bookingData.dateRange.startDate || !bookingData.dateRange.endDate) {
      res.status(400).json({
        success: false,
        message: "Both startDate and endDate are required in dateRange",
      });
      return;
    }

    // Create the hotel booking
    const newBooking = await createHotelBookingService(userId, bookingData);

    res.status(201).json({
      success: true,
      message: "Hotel booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("Create hotel booking error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getUserHotelBookingsController = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const hotelBookings = await getUserHotelBookingsService(userId);

    res.status(200).json({
      success: true,
      count: hotelBookings.length,
      data: hotelBookings,
    });
  } catch (error) {
    console.error("Get hotel bookings error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const editUserController = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {

    const { id, name, email, userType, password } = req.body;


    if (!id || !name || !email || !userType) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: id, name, email, and userType are required"
      });
      return;
    }


    const validUserTypes = ['user', 'admin', 'premium_traveler'];
    if (!validUserTypes.includes(userType)) {
      res.status(400).json({
        success: false,
        message: "Invalid userType. Must be one of: user, admin, premium_traveler"
      });
      return;
    }


    const updateData: any = {
      name,
      email,
      userType
    };


    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await editUserService(id, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error: any) {
    console.error("Error in editUserController:", error);

    if (error.message === "User not found") {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    if (error.message === "Email already in use") {
      res.status(409).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating user"
    });
  }
}

export const createPackageBookingController = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const bookingData = req.body;

    // Validate required fields
    const requiredFields = [
      "packageReference",
      "dateStart",
      "totalPrice",
      "image"
    ];
    
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
        return;
      }
    }

    // Validate dateStart is a valid date
    const dateStart = new Date(bookingData.dateStart);
    if (isNaN(dateStart.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid dateStart format",
      });
      return;
    }

    // Validate dateStart is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateStart < today) {
      res.status(400).json({
        success: false,
        message: "Start date must be today or in the future",
      });
      return;
    }

    // Validate totalPrice is positive
    if (bookingData.totalPrice <= 0) {
      res.status(400).json({
        success: false,
        message: "Total price must be greater than 0",
      });
      return;
    }

    // Create the package booking
    const newBooking = await createPackageBookingService(userId, bookingData);

    res.status(201).json({
      success: true,
      message: "Package booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("Create package booking error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getUserPackageBookingsController = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const packageBookings = await getUserPackageBookingsService(userId);

    res.status(200).json({
      success: true,
      count: packageBookings.length,
      data: packageBookings,
    });
  } catch (error) {
    console.error("Get package bookings error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};