import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ActivityData {
    action: string;
    amount?: number;
    opportunity?: string;
    userId: number;
  }
export const getAllActivities = async () => {
  return await prisma.activity.findMany({
    include: { user: true },
    orderBy: { timestamp: 'desc' }
  });
};

export const createActivity = async ({ userId, action, amount, opportunity }: ActivityData) => {
    return await prisma.activity.create({
      data: {
        userId,
        action,
        amount,
        opportunity
      }
    });
  };

export const deleteActivity = async (id: number) => {
  return await prisma.activity.delete({
    where: { id }
  });
};

