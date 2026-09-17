import { Router } from 'express';
import { route } from '../controllers/route.controller.js';
const router = Router();
router.get('/', route);
export default router;
