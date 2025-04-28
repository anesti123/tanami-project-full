import { Request, Response } from 'express';
import { getAllActivities, createActivity, deleteActivity } from '../services/activityService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getActivities = async (req: Request, res: Response) => {
  const activities = await getAllActivities();
  res.json(activities);
};

export const postActivity = async (req: Request, res: Response) => {
    const io = req.app.get('io');
    const id = res.locals.id as number;
    const { action, amount, opportunity } = req.body;
  
    if (!action) {
      return res.status(400).json({ message: 'Action is required' });
    }
  
    const activity = await createActivity({ userId: id, action, amount, opportunity });
    io.emit('new_activity', activity);
    res.status(201).json(activity);
  };

export const removeActivity = async (req: Request, res: Response) => {
  const activityId = parseInt(req.params.id);
  if (isNaN(activityId)) {
    return res.status(400).json({ message: 'Invalid activity ID' });
  }
  try {
    const deleted = await deleteActivity(activityId);
    res.json(deleted);
  } catch (error) {
    res.status(404).json({ message: 'Activity not found' });
  }
};

export const simulateStock = async (req: Request, res: Response) => {
    const io = req.app.get('io');
  
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@tanami.com' }
    });
    if (!adminUser) {
      return res.status(500).json({ message: 'Admin user not found' });
    }
    const adminId = adminUser.id;
  
    const interval = setInterval(async () => {
      const simulatedStockPrice = parseFloat((Math.random() * (500 - 100) + 100).toFixed(2));
      const action = "simulate_stock_update";
      const amount = simulatedStockPrice;
      const opportunity = "Simulated Stock";
  
      try {
        const activity = await createActivity({ action, amount, opportunity, userId: adminId });
        io.emit('new_activity', activity);
      } catch (err) {
        console.error("Error creating simulated activity:", err);
      }
    }, 30000);
  
    res.status(200).json({ message: 'Stock price simulation triggered, updates every 10 seconds' });
  };