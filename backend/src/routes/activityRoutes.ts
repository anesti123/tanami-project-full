import { Router } from 'express';
import { getActivities, postActivity, removeActivity, simulateStock } from '../controllers/activityController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getActivities);
router.post('/', authenticateToken, postActivity);
router.delete('/:id', authenticateToken, removeActivity);
router.post('/simulate_stock', simulateStock);

export default router;
