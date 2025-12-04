import express from "express";
import {
  FilterCriteria,
  getAllDestinations,
  getDestinationById,
  getFilteredDestinations,
  getPopularDestinations,
  searchDestinations,
} from "../services/destinationServices.ts";

export const getPopular = async (req: express.Request, res: express.Response) => {
  try {
    const { search } = req.body;
    const popular = await getPopularDestinations(search || "");
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

export const getFiltered = async (req: express.Request, res: express.Response) => {
  try {
    const { province, activityType, priceRange } = req.body;
    
    const filters: FilterCriteria = {
      province: province?.trim(),
      activityType: activityType?.trim(),
      priceRange: priceRange?.trim()
    };
    
    const destinations = await getFilteredDestinations(filters);
    return res.json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    console.error('Error fetching filtered destinations:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while fetching destinations" 
    });
  }
};