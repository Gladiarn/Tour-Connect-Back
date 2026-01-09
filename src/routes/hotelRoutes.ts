import express from 'express';
import { HotelController } from '../controllers/hotelController.ts';

const router = express.Router();

// 🟡 Create instance of the controller
const hotelController = new HotelController();

// Routes using instance methods
router.get('/all', hotelController.getAll);
router.get('/location', hotelController.getByLocation);
router.get('/:hotelReference/:roomReference', hotelController.getRoom);
router.post('/create', hotelController.createHotel);
router.put('/:reference', hotelController.updateHotel);
router.delete('/:reference', hotelController.deleteHotel);

export default router;