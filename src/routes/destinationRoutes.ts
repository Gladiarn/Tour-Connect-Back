import express from 'express';
import { 
  getPopular, 
  search, 
  getAll, 
  getById, 
  getFiltered,
  createDestination,
  deleteDestination
} from '../controllers/destinationController.ts';

const router = express.Router();

router.post('/popular', getPopular);
router.get('/search', search);
router.get('/all', getAll);
router.get('/:id', getById);
router.post('/filter', getFiltered);
router.post('/create', createDestination);
router.delete('/:id', deleteDestination);

export default router;