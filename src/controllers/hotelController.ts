import express from "express";
import hotelModel from "../models/hotelModel.ts";
import { 
  getHotelsByLocation, 
  getAllHotels, 
  getRoomByReferences, 
  createNewHotel,
  deleteHotelService,
  updateHotelService
} from "../services/hotelServices.ts";

export const updateHotel = async (req: express.Request, res: express.Response) => {
  try {
    const { reference } = req.params;
    const hotelData = req.body;

    if (!reference) {
      return res.status(400).json({ 
        success: false, 
        message: "Hotel reference is required" 
      });
    }

    // Basic validation
    if (hotelData.name && !hotelData.name.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Hotel name cannot be empty" 
      });
    }

    if (hotelData.location && !hotelData.location.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Location cannot be empty" 
      });
    }

    // Validate rooms if being updated
    if (hotelData.rooms && Array.isArray(hotelData.rooms)) {
      for (let i = 0; i < hotelData.rooms.length; i++) {
        const room = hotelData.rooms[i];
        if (!room.roomReference || !room.name || !room.price) {
          return res.status(400).json({ 
            success: false, 
            message: `Room ${i + 1} is missing required fields (roomReference, name, or price)` 
          });
        }
      }
    }

    // Update hotel
    const updatedHotel = await updateHotelService(reference, hotelData);

    if (!updatedHotel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hotel not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: updatedHotel
    });

  } catch (error: any) {
    console.error("Error updating hotel:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "Duplicate entry. Hotel reference must be unique." 
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed", 
        errors: messages 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "Server error while updating hotel" 
    });
  }
};

export const getByLocation = async (req: express.Request, res: express.Response) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const hotels = await getHotelsByLocation(location as string);
    return res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels by location:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const hotels = await getAllHotels();
    return res.json(hotels);
  } catch (error) {
    console.error("Error fetching all hotels:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getRoom = async (req: express.Request, res: express.Response) => {
  try {
    const { hotelReference, roomReference } = req.params;
    
    const roomData = await getRoomByReferences(hotelReference, roomReference);
    
    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.json(roomData);
  } catch (error) {
    console.error("Error fetching room:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createHotel = async (req: express.Request, res: express.Response) => {
  try {
    const hotelData = req.body;


    if (!hotelData.name || !hotelData.location || !hotelData.reference) {
      return res.status(400).json({ 
        success: false, 
        message: "Hotel name, location, and reference are required" 
      });
    }


    if (!hotelData.rooms || !Array.isArray(hotelData.rooms) || hotelData.rooms.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one room is required" 
      });
    }

    // Validate each room
    for (let i = 0; i < hotelData.rooms.length; i++) {
      const room = hotelData.rooms[i];
      if (!room.roomReference || !room.name || !room.price) {
        return res.status(400).json({ 
          success: false, 
          message: `Room ${i + 1} is missing required fields (roomReference, name, or price)` 
        });
      }
    }

    // Check if hotel with same reference already exists
    const existingHotel = await hotelModel.findOne({ reference: hotelData.reference });
    if (existingHotel) {
      return res.status(409).json({ 
        success: false, 
        message: "Hotel with this reference already exists" 
      });
    }

    // Create hotel using the renamed service function
    const newHotel = await createNewHotel(hotelData);

    return res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: newHotel
    });

  } catch (error: any) {
    console.error("Error creating hotel:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "Duplicate entry. Hotel reference must be unique." 
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed", 
        errors: messages 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "Server error while creating hotel" 
    });
  }
};

export const deleteHotel = async (req: express.Request, res: express.Response) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ 
        success: false, 
        message: "Hotel reference is required" 
      });
    }

    const result = await deleteHotelService(reference);

    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel deleted successfully"
    });

  } catch (error: any) {
    console.error("Error deleting hotel:", error);
    
    return res.status(500).json({ 
      success: false, 
      message: "Server error while deleting hotel" 
    });
  }
};