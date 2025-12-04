  import express from "express";
  import bcrypt from "bcryptjs";
  import {
    findUser,
    findUserById,
    insertUserServices,
    logoutService,
    getAllUsers,
    createHotelBookingService,
    getUserHotelBookingsService
  } from "../services/userServices.ts";
  import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.ts";

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
        userType: user.userType
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
        res.status(404).json({ message: "Token not found or already invalidated" });
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
      
      const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user.toObject();
      
      res.status(200).json({
        success: true,
        data: userWithoutSensitiveData
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
      data: users
    });
    
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
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
    const requiredFields = ['name', 'phoneNumber', 'address', 'dateRange', 'nightCount', 'totalPrice', 'roomReference', 'hotelReference'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        res.status(400).json({ 
          success: false, 
          message: `Missing required field: ${field}` 
        });
        return;
      }
    }

    // Validate dateRange structure
    if (!bookingData.dateRange.startDate || !bookingData.dateRange.endDate) {
      res.status(400).json({ 
        success: false, 
        message: "Both startDate and endDate are required in dateRange" 
      });
      return;
    }

    // Create the hotel booking
    const newBooking = await createHotelBookingService(userId, bookingData);
    
    res.status(201).json({
      success: true,
      message: "Hotel booking created successfully",
      data: newBooking
    });
    
  } catch (error) {
    console.error("Create hotel booking error:", error);
    res.status(500).json({ 
      success: false,
      message: error instanceof Error ? error.message : "Internal server error" 
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
      data: hotelBookings
    });
    
  } catch (error) {
    console.error("Get hotel bookings error:", error);
    res.status(500).json({ 
      success: false,
      message: error instanceof Error ? error.message : "Internal server error" 
    });
  }
};