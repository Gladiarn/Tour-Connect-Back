import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageByReference,
  updatePackage,
  deletePackage,
  getFilteredPackages
} from "../controllers/packageController.ts";

const router = express.Router();

// Create a new package
router.post("/create", createPackage);

// Get all packages will delete
router.get("/all", getAllPackages);

// get all + filter
router.post("/filter", getFilteredPackages);

// Get package by reference
router.get("/:reference", getPackageByReference);

// Update package by reference
router.put("/:reference", updatePackage);

// Delete package by reference
router.delete("/:reference", deletePackage);

export default router;
