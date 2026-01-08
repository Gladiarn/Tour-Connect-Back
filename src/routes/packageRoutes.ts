import express from "express";
import { PackageController } from "../controllers/packageController.ts";

const router = express.Router();
const packageController = new PackageController();

// Create a new package
router.post("/create", packageController.createPackage);

// get all + filter
router.post("/filter", packageController.getFilteredPackages);

// Get package by reference
router.get("/:reference", packageController.getPackageByReference);

// Update package by reference
router.put("/:reference", packageController.updatePackage);

// Delete package by reference
router.delete("/:reference", packageController.deletePackage);

export default router;
