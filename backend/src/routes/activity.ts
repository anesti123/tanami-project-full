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

    // Create new activity in the database
    const activity = await prisma.activity.create({
      data: {
        content,
        userId: decoded.id
      }
    });

    // Emit the new activity via WebSocket
    io.emit('new_activity', activity);

    res.status(201).json(activity);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
