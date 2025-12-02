import express from 'express';
import { getPopularDestinations, searchDestinations } from '../services/destinationServices.ts';
import { getAll, getById, getPopular, search } from '../controllers/destinationController.ts';

const router = express.Router();

router.post('/popular', getPopular);

router.get('/search', search);

router.get('/all', getAll)

router.get('/:id', getById)
export default router;