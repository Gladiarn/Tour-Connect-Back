import express from 'express';
const router = express.Router();

import { handleChat } from '@/controllers/aiController.ts';

router.post('/chat', handleChat);


export default router;