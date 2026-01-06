import express from "express";
import destinationModel from "../models/destinationModel.ts";
import { DestinationService, FilterCriteria } from "../services/destinationServices.ts";

export class DestinationController {
  private destinationService: DestinationService;

  constructor(destinationService?: DestinationService, FilterCriteria?: any) {
    this.destinationService =
      destinationService || new DestinationService();
  }
  // Update destination
  updateDestination = async (req: express.Request, res: express.Response) => {
    try {
      const { reference } = req.params;
      const updateData = req.body;

      if (updateData.name !== undefined && !updateData.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      if (updateData.location !== undefined && !updateData.location.trim()) {
        return res.status(400).json({
          success: false,
          message: "Location cannot be empty",
        });
      }

      // Validate rating if provided
      if (updateData.rating !== undefined && (updateData.rating < 0 || updateData.rating > 5)) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 0 and 5",
        });
      }

      // Validate budget if provided
      if (updateData.budget !== undefined && updateData.budget < 0) {
        return res.status(400).json({
          success: false,
          message: "Budget cannot be negative",
        });
      }

      if (updateData.reference && updateData.reference !== reference) {
        const existingDestination = await destinationModel.findOne({
          reference: updateData.reference
        });

        if (existingDestination) {
          return res.status(409).json({
            success: false,
            message: "Destination with this reference already exists",
          });
        }
      }

      // Update the destination using reference
      const updatedDestination = await this.destinationService.updateDestination(reference, updateData);

      if (!updatedDestination) {
        return res.status(404).json({
          success: false,
          message: "Destination not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Destination updated successfully",
        data: updatedDestination,
      });
    } catch (error: any) {
      console.error("Error updating destination:", error);

      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate entry. Destination reference must be unique.",
        });
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(
          (err: any) => err.message
        );
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: messages,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server error while updating destination",
      });
    }
  };

  // Get popular destinations
  getPopular = async (req: express.Request, res: express.Response) => {
    try {
      const { search } = req.body;
      const popular = await this.destinationService.getPopularDestinations(search || "");
      return res.json(popular);
    } catch (error) {
      console.error("Error fetching popular destinations:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Search destinations
  search = async (req: express.Request, res: express.Response) => {
    try {
      const { location, activityType, minPrice, maxPrice } = req.query;

      const destinations = await this.destinationService.searchDestinations(
        location as string,
        activityType as string,
        Number(minPrice),
        Number(maxPrice)
      );

      return res.json(destinations);
    } catch (error) {
      console.error("Error searching destinations:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Get all destinations
  getAll = async (req: express.Request, res: express.Response) => {
    try {
      const destinations = await this.destinationService.getAllDestinations();
      return res.json(destinations);
    } catch (error) {
      console.error("Error fetching all destinations:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Get destination by ID
  getById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const destination = await this.destinationService.getDestinationById(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      return res.json(destination);
    } catch (error) {
      console.error("Error fetching destination by ID:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Get filtered destinations
  getFiltered = async (req: express.Request, res: express.Response) => {
    try {
      const { province, activityType, priceRange } = req.body;

      const filters: FilterCriteria = {
        province: province?.trim(),
        activityType: activityType?.trim(),
        priceRange: priceRange?.trim(),
      };

      const destinations = await this.destinationService.getFilteredDestinations(filters);
      return res.json({
        success: true,
        count: destinations.length,
        data: destinations,
      });
    } catch (error) {
      console.error("Error fetching filtered destinations:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching destinations",
      });
    }
  };

  // Create destination
  createDestination = async (req: express.Request, res: express.Response) => {
    try {
      const destinationData = req.body;

      // Validate required fields
      if (
        !destinationData.name ||
        !destinationData.reference ||
        !destinationData.location
      ) {
        return res.status(400).json({
          success: false,
          message: "Name, reference, and location are required",
        });
      }

      // Validate rating
      if (destinationData.rating < 0 || destinationData.rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 0 and 5",
        });
      }

      // Validate budget
      if (destinationData.budget < 0) {
        return res.status(400).json({
          success: false,
          message: "Budget cannot be negative",
        });
      }

      // Check if destination with same reference already exists
      const existingDestination = await destinationModel.findOne({
        reference: destinationData.reference,
      });

      if (existingDestination) {
        return res.status(409).json({
          success: false,
          message: "Destination with this reference already exists",
        });
      }

      // Create destination using the service
      const newDestination = await this.destinationService.createDestination(destinationData);

      return res.status(201).json({
        success: true,
        message: "Destination created successfully",
        data: newDestination,
      });
    } catch (error: any) {
      console.error("Error creating destination:", error);

      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate entry. Destination reference must be unique.",
        });
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(
          (err: any) => err.message
        );
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: messages,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server error while creating destination",
      });
    }
  };

  // Delete destination
  deleteDestination = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid destination ID format",
        });
      }

      const result = await this.destinationService.deleteDestination(id);

      if (!result.success) {
        return res.status(result.statusCode || 400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Destination deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting destination:", error);

      return res.status(500).json({
        success: false,
        message: "Server error while deleting destination",
      });
    }
  };
}