
import express from 'express';
import { 
  getByLocation, 
  getAll, 
  getRoom, 
  createHotel, 
  deleteHotel,
  updateHotel
} from '../controllers/hotelController.ts';

const router = express.Router();

router.get('/all', getAll);
router.get('/location', getByLocation);
router.get('/:hotelReference/:roomReference', getRoom);
router.post('/create', createHotel);
router.put('/:reference', updateHotel);
router.delete('/:reference', deleteHotel);

export default router;