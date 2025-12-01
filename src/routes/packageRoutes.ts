import express from "express";
import {
  createPackage,
  getAllPackages,
  getPackageByReference,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.ts";

const router = express.Router();

// Create a new package
router.post("/create", createPackage);

// Get all packages
router.get("/all", getAllPackages);

// Get package by reference
router.get("/:reference", getPackageByReference);

// Update package by reference
router.put("/:reference", updatePackage);

// Delete package by reference
router.delete("/:reference", deletePackage);

export default router;
