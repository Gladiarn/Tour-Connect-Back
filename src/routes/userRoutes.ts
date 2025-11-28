import express from 'express';
import { validateUserCreation } from '../middlewares/userMiddlewares';
import { createUser } from '../controllers/userController';

const router = express.Router();

router.get('/create', validateUserCreation, createUser)






export default router;