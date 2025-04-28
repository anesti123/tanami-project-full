import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Get all activities
router.get('/', async (req: Request, res: Response) => {
  const activities = await prisma.activity.findMany({
    include: { user: true },
    orderBy: { timestamp: 'desc' }
  });
  res.json(activities);
});

// Post a new activity
router.post('/', async (req: Request, res: Response) => {
  const io = req.app.get('io');
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { content } = req.body;

    const activity = await prisma.activity.create({
      data: {
        content,
        userId: decoded.id
      }
    });

    io.emit('new_activity', activity);

    res.status(201).json(activity);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Delete an activity
router.delete('/:id', async (req: Request, res: Response) => {
  const activityId = parseInt(req.params.id);

  if (isNaN(activityId)) {
    return res.status(400).json({ message: 'Invalid activity ID' });
  }

  try {
    const deletedActivity = await prisma.activity.delete({
      where: { id: activityId },
    });
    res.json(deletedActivity);
  } catch (error) {
    res.status(404).json({ message: 'Activity not found' });
  }
});

router.post('/simulate_stock', async (req: Request, res: Response) => {
  const io = req.app.get('io');

  // Set interval to 30 seconds (30,000 ms)
  const interval = setInterval(() => {
    const simulatedStockPrice = (Math.random() * (500 - 100) + 100).toFixed(2);
    
    // Generate unique ID for each simulated activity
    const activity = {
      id: Date.now(), // Use Date.now() for unique ID
      content: `Stock price: $${simulatedStockPrice}`,
      stockPrice: simulatedStockPrice,
      timestamp: new Date(),
    };

    // Emit the new activity via socket
    io.emit('new_activity', activity);
  }, 10000); // 30 seconds

  res.status(200).json({ message: 'Stock price simulation triggered, updates every 30 seconds' });
});

export default router;
