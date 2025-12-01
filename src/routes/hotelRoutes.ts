
import express from 'express';
import { getByLocation, getAll, getRoom } from '../controllers/hotelController.ts';

const router = express.Router();

router.get('/all', getAll);
router.get('/location', getByLocation);
router.get('/:hotelReference/:roomReference', getRoom);

export default router;