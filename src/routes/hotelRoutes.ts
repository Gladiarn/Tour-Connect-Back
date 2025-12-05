import express from 'express';
import { getByLocation, getAll, getRoom, createHotel } from '../controllers/hotelController.ts';

const router = express.Router();

router.get('/all', getAll);
router.get('/location', getByLocation);
router.get('/:hotelReference/:roomReference', getRoom);
router.post('/create', createHotel); // Add this route

export default router;