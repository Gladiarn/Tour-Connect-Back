import destinationModel from "../models/destinationModel.ts";

export const getAllDestinations = async (): Promise<IDestination[]> => {
  return await destinationModel.find().sort({ createdAt: -1 });
};

// Get destination by ID
export const getDestinationById = async (
  id: string
): Promise<IDestination | null> => {
  return await destinationModel.findOne({reference: id });
};

export const createDestination = async (
  destinationData: Partial<IDestination>
): Promise<IDestination> => {
  const destination = new destinationModel(destinationData);
  return await destination.save();
};

// Update destination
export const updateDestination = async (
  id: string,
  updateData: Partial<IDestination>
): Promise<IDestination | null> => {
  return await destinationModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

// Delete destination
export const deleteDestination = async (
  id: string
): Promise<IDestination | null> => {
  return await destinationModel.findByIdAndDelete(id);
};

// Popular
export const getPopularDestinations = async () => {
  return await destinationModel.find({ rating: { $gte: 4 } });
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
