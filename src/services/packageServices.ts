import packageModel from "../models/packageModel.ts";

export interface FilterCriteria {
  tourType?: string;
  packSize?: string;
  priceRange?: string;
}

// Create a new package
export const createPackageService = async (packageData: any) => {
  const newPackage = new packageModel(packageData);
  const savedPackage = await newPackage.save();
  return savedPackage;
};

// Get all packages
export const getAllPackagesService = async () => {
  const packages = await packageModel.find().sort({ createdAt: -1 });
  return packages;
};

// Get filtered packages (NEW)
export const getFilteredPackagesService = async (filters: FilterCriteria) => {
  try {
    const query: any = {};

    // Check if any filters are provided
    const hasFilters = Object.values(filters).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (!hasFilters) {
      return await packageModel.find().sort({ createdAt: -1 });
    }

    // Filter by tourType (location or name)
    if (filters.tourType && filters.tourType.trim()) {
      const tourTypeRegex = new RegExp(filters.tourType.trim(), "i");
      query.$or = [
        { location: { $regex: tourTypeRegex } },
        { name: { $regex: tourTypeRegex } }
      ];
    }

    // Filter by packSize
    if (filters.packSize && filters.packSize.trim()) {
      const packSizeCondition = parsePackSize(filters.packSize);
      if (packSizeCondition) {
        query.$and = [
          { "packsize.min": { $gte: packSizeCondition.min } },
          { "packsize.max": { $lte: packSizeCondition.max } }
        ];
      }
    }

    // Filter by priceRange
    if (filters.priceRange && filters.priceRange.trim()) {
      const priceRange = parsePriceRange(filters.priceRange);
      if (priceRange) {
        query.price = {
          $gte: priceRange.min,
          $lte: priceRange.max,
        };
      }
    }

    return await packageModel.find(query).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

// Parse packSize string like "1 - 5" or "15+"
const parsePackSize = (packSizeStr: string): { min: number; max: number } | null => {
  try {
    const cleanStr = packSizeStr.trim();
    
    // Handle "15+" case
    if (cleanStr.endsWith('+')) {
      const min = parseInt(cleanStr.replace('+', '').trim());
      if (!isNaN(min)) {
        return { min, max: Infinity };
      }
    }
    
    // Handle "1 - 5" case
    const parts = cleanStr.split(/[-–]/);
    if (parts.length === 2) {
      const min = parseInt(parts[0].trim());
      const max = parseInt(parts[1].trim());
      
      if (!isNaN(min) && !isNaN(max)) {
        return { min, max };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error parsing packSize:", error);
    return null;
  }
};

// Parse price range string
const parsePriceRange = (priceRange: string): { min: number; max: number } | null => {
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
};

// Get package by reference
export const getPackageByReferenceService = async (reference: string) => {
  const packageItem = await packageModel.findOne({ reference });
  return packageItem;
};

// Update package by reference
export const updatePackageService = async (reference: string, updateData: any) => {
  try {
    const currentPackage = await packageModel.findOne({ reference });
    
    if (!currentPackage) {
      throw new Error('Package not found');
    }
    
    if (updateData.packsize) {
      const finalPacksize = {
        min: updateData.packsize.min !== undefined 
          ? updateData.packsize.min 
          : currentPackage.packsize.min,
        max: updateData.packsize.max !== undefined 
          ? updateData.packsize.max 
          : currentPackage.packsize.max
      };
      
      if (finalPacksize.max < finalPacksize.min) {
        throw new Error('Maximum pack size must be greater than or equal to minimum');
      }
      
      updateData.packsize = finalPacksize;
    }
    
    const updatedPackage = await packageModel.findOneAndUpdate(
      { reference },
      updateData,
      { new: true, runValidators: true }
    );
    
    return updatedPackage;
  } catch (error: any) {
    console.error("Update package service error:", error);
    throw error;
  }
};

// Delete package by reference
export const deletePackageService = async (reference: string) => {
  const result = await packageModel.findOneAndDelete({ reference });
  return !!result;
};