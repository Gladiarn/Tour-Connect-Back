import { PackageService } from '../services/packageServices.ts';

export class PackageController {
  private packageService: PackageService;

  constructor(packageService?: PackageService) {
    this.packageService = packageService || new PackageService();
  }

  // Create package
  createPackage = async (req: any, res: any) => {
    try {
      const packageData = req.body;
      
      const newPackage = await this.packageService.createPackageService(packageData);
      
      res.status(201).json({
        success: true,
        message: 'Package created successfully',
        data: newPackage
      });
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'Package with this reference already exists'
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: `Failed to create package: ${error.message}`
      });
    }
  };

  // Get filtered packages
  getFilteredPackages = async (req: any, res: any) => {
    try {
      const { tourType, packSize, priceRange } = req.body;
      
      const filters = {
        tourType: tourType?.trim(),
        packSize: packSize?.trim(),
        priceRange: priceRange?.trim()
      };
      
      const packages = await this.packageService.getFilteredPackagesService(filters);
      
      res.status(200).json({
        success: true,
        count: packages.length,
        data: packages
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Failed to fetch filtered packages: ${error.message}`
      });
    }
  };

  // Get package by reference
  getPackageByReference = async (req: any, res: any) => {
    try {
      const { reference } = req.params;
      
      const packageItem = await this.packageService.getPackageByReferenceService(reference);
      
      if (!packageItem) {
        res.status(404).json({
          success: false,
          message: 'Package not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: packageItem
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Failed to fetch package: ${error.message}`
      });
    }
  };

  // Update package
  updatePackage = async (req: any, res: any) => {
    try {
      const { reference } = req.params;
      const updateData = req.body;
      
      const updatedPackage = await this.packageService.updatePackageService(reference, updateData);
      
      if (!updatedPackage) {
        res.status(404).json({
          success: false,
          message: 'Package not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Package updated successfully',
        data: updatedPackage
      });
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'Package reference already exists'
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: `Failed to update package: ${error.message}`
      });
    }
  };

  // Delete package
  deletePackage = async (req: any, res: any) => {
    try {
      const { reference } = req.params;
      
      const isDeleted = await this.packageService.deletePackageService(reference);
      
      if (!isDeleted) {
        res.status(404).json({
          success: false,
          message: 'Package not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Package deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Failed to delete package: ${error.message}`
      });
    }
  };
}