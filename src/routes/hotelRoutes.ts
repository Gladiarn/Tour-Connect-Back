import express from 'express';
import { getByLocation, getAll, getRoom, createHotel, deleteHotel } from '../controllers/hotelController.ts';

const router = express.Router();

router.get('/all', getAll);
router.get('/location', getByLocation);
router.get('/:hotelReference/:roomReference', getRoom);
router.post('/create', createHotel);
router.delete('/:reference', deleteHotel); // Add delete route

export default router;