import { Router } from 'express';
import { createShare, getShare } from '../controllers/share.controller.js';
const router = Router();
router.post('/', createShare);
router.get('/:slug', getShare);
export default router;
