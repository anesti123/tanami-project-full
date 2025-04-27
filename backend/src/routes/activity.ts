import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
let activities: any[] = [];

router.get('/', (req: Request, res: Response) => {
  res.json(activities);
});

router.post('/', (req: Request, res: Response) => {
  const io = req.app.get('io');
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    const { content } = req.body;
    const activity = { id: activities.length + 1, user, content, timestamp: new Date() };
    activities.push(activity);
    io.emit('new_activity', activity);
    res.status(201).json(activity);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
