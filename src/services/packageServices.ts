import packageModel from "../models/packageModel.ts";

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