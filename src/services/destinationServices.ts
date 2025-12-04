import destinationModel from "../models/destinationModel.ts";

export const getAllDestinations = async () => {
  return await destinationModel.find().sort({ createdAt: -1 });
};

// Get destination by ID
export const getDestinationById = async (
  id: string
) => {
  return await destinationModel.findOne({reference: id });
};

export const createDestination = async (
  destinationData:any
) => {
  const destination = new destinationModel(destinationData);
  return await destination.save();
};

// Update destination
export const updateDestination = async (
  id: string,
  updateData: any
) => {
  return await destinationModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

// Delete destination
export const deleteDestination = async (
  id: string
) => {
  return await destinationModel.findByIdAndDelete(id);
};

// Popular
export const getPopularDestinations = async (search: string = "") => {
  try {
    const query: any = { rating: { $gte: 4 } };
    
    // Add search filter if provided
    if (search.trim()) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { location: searchRegex },
        { activityType: searchRegex },
        { description: searchRegex }
      ];
    }
    
    return await destinationModel.find(query).sort({ rating: -1 })
  } catch (error) {
    throw error;
  }
};

export const searchDestinations = async (location: string, activityType: string, minPrice: number, maxPrice: number) => {
  const query: any = {};

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (activityType) {
    query.activityType = { $regex: activityType, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    query.budget = {};
    if (minPrice) query.budget.$gte = minPrice;
    if (maxPrice) query.budget.$lte = maxPrice;
  }

  return await destinationModel.find(query);
};

export interface FilterCriteria {
  province?: string;
  activityType?: string;
  priceRange?: string;
}

export const getFilteredDestinations = async (filters: FilterCriteria) => {
  try {
    const query: any = {};
    
    const hasFilters = Object.values(filters).some(value => 
      value !== undefined && value !== null && value !== ''
    );
    
    if (!hasFilters) {
      return await destinationModel.find().sort({ createdAt: -1 });
    }
    
    if (filters.province && filters.province.trim()) {
      const provinceRegex = new RegExp(filters.province.trim(), 'i');
      query.location = { $regex: provinceRegex };
    }
    
    if (filters.activityType && filters.activityType.trim()) {
      const activityRegex = new RegExp(filters.activityType.trim(), 'i');
      query.activityType = { $regex: activityRegex };
    }
    
    if (filters.priceRange && filters.priceRange.trim()) {
      const priceRange = parsePriceRange(filters.priceRange);
      if (priceRange) {
        query.budget = {
          $gte: priceRange.min,
          $lte: priceRange.max
        };
      }
    }
    
    return await destinationModel.find(query).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

const parsePriceRange = (priceRange: string): { min: number; max: number } | null => {
  try {
    const cleanRange = priceRange.replace(/,/g, '').replace(/\s+/g, '');
    const parts = cleanRange.split(/[-–]/);
    
    if (parts.length !== 2) return null;
    
    const min = parseInt(parts[0].trim());
    const max = parseInt(parts[1].trim());
    
    if (isNaN(min) || isNaN(max)) return null;
    
    return { min, max };
  } catch (error) {
    console.error('Error parsing price range:', error);
    return null;
  }
};