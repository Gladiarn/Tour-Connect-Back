import express from "express";
import { DestinationController } from "../controllers/destinationController.ts";

const destinationController = new DestinationController();
const router = express.Router();

router.post("/popular", destinationController.getPopular);
router.get("/search", destinationController.search);
router.get("/all", destinationController.getAll);
router.get("/:id", destinationController.getById);
router.post("/filter", destinationController.getFiltered);
router.post("/create", destinationController.createDestination);
router.delete("/:id", destinationController.deleteDestination);
router.put("/:reference", destinationController.updateDestination);

export default router;
