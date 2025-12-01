import express from "express";
import {
  getAllDestinations,
  getDestinationById,
  getPopularDestinations,
  searchDestinations,
} from "../services/destinationServices.ts";

export const getPopular = async (req: express.Request, res: express.Response) => {
  try {
    const popular = await getPopularDestinations();
    return res.json(popular);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const search = async (req: express.Request, res: express.Response) => {
  try {
    const { location, activityType, minPrice, maxPrice } = req.query;

    const destinations = await searchDestinations(
      location as string,
      activityType as string,
      Number(minPrice),
      Number(maxPrice)
    );

    return res.json(destinations);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const destinations = await getAllDestinations();
    return res.json(destinations);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const destination = await getDestinationById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    return res.json(destination);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
