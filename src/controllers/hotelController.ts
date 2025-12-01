
import express from "express";
import { getHotelsByLocation, getAllHotels, getRoomByReferences } from "../services/hotelServices.ts";

export const getByLocation = async (req: express.Request, res: express.Response) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const hotels = await getHotelsByLocation(location as string);
    return res.json(hotels);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const hotels = await getAllHotels();
    return res.json(hotels);
  } catch (error) {
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
    return res.status(500).json({ message: "Server error" });
  }
};