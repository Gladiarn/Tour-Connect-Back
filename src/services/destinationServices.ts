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
