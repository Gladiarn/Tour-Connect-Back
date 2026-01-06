import destinationModel, { IDestination } from "../models/destinationModel.ts";

export interface FilterCriteria {
  province?: string;
  activityType?: string;
  priceRange?: string;
}

export class DestinationService {
  // Update destination
  async updateDestination(reference: string, updateData: any) {
    return await destinationModel.findOneAndUpdate(
      { reference: reference },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Get all destinations
  async getAllDestinations() {
    return await destinationModel.find().sort({ createdAt: -1 });
  }

  // Get destination by ID
  async getDestinationById(id: string) {
    return await destinationModel.findOne({ reference: id });
  }

  // Create destination
  async createDestination(destinationData: Partial<IDestination>) {
    const destination = new destinationModel(destinationData);
    return await destination.save();
  }

  // Delete destination
  async deleteDestination(id: string) {
    try {
      const result = await destinationModel.findByIdAndDelete(id);
      
      if (!result) {
        return {
          success: false,
          message: "Destination not found",
          statusCode: 404
        };
      }

      return {
        success: true,
        message: "Destination deleted successfully"
      };

    } catch (error: any) {
      console.error("Error in deleteDestination service:", error);
      
      if (error.name === 'CastError') {
        return {
          success: false,
          message: "Invalid destination ID format",
          statusCode: 400
        };
      }
      
      return {
        success: false,
        message: error.message || "Failed to delete destination",
        statusCode: 500
      };
    }
  }

  // Get popular destinations
  async getPopularDestinations(search: string = "") {
    try {
      const query: any = { rating: { $gte: 4 } };

      // Add search filter if provided
      if (search.trim()) {
        const searchRegex = new RegExp(search, "i");
        query.$or = [
          { name: searchRegex },
          { location: searchRegex },
          { activityType: searchRegex },
          { description: searchRegex },
        ];
      }

      return await destinationModel.find(query).sort({ rating: -1 });
    } catch (error) {
      throw error;
    }
  }

  // Search destinations
  async searchDestinations(
    location: string,
    activityType: string,
    minPrice: number,
    maxPrice: number
  ) {
    const query: any = {};

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (activityType) {
      query.activityType = { $regex: activityType, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.budget = {};
      if (minPrice) query.budget.$gte = minPrice;
      if (maxPrice) query.budget.$lte = maxPrice;
    }

    return await destinationModel.find(query);
  }

  // Get filtered destinations
  async getFilteredDestinations(filters: FilterCriteria) {
    try {
      const query: any = {};

      const hasFilters = Object.values(filters).some(
        (value) => value !== undefined && value !== null && value !== ""
      );

      if (!hasFilters) {
        return await destinationModel.find().sort({ createdAt: -1 });
      }

      if (filters.province && filters.province.trim()) {
        const provinceRegex = new RegExp(filters.province.trim(), "i");
        query.location = { $regex: provinceRegex };
      }

      if (filters.activityType && filters.activityType.trim()) {
        const activityRegex = new RegExp(filters.activityType.trim(), "i");
        query.activityType = { $regex: activityRegex };
      }

      if (filters.priceRange && filters.priceRange.trim()) {
        const priceRange = this.parsePriceRange(filters.priceRange);
        if (priceRange) {
          query.budget = {
            $gte: priceRange.min,
            $lte: priceRange.max,
          };
        }
      }

      return await destinationModel.find(query).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  // Private helper method
  private parsePriceRange(
    priceRange: string
  ): { min: number; max: number } | null {
    try {
      const cleanRange = priceRange.replace(/,/g, "").replace(/\s+/g, "");
      const parts = cleanRange.split(/[-–]/);

      if (parts.length !== 2) return null;

      const min = parseInt(parts[0].trim());
      const max = parseInt(parts[1].trim());

      if (isNaN(min) || isNaN(max)) return null;

      return { min, max };
    } catch (error) {
      console.error("Error parsing price range:", error);
      return null;
    }
  }
}