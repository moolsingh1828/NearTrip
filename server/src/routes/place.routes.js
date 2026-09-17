import { Router } from 'express';
import { nearby, details } from '../controllers/place.controller.js';
const router = Router();
router.get('/nearby', nearby);
router.get('/:id', details);
export default router;
