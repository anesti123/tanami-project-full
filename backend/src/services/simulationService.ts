import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function startStockSimulation(io: any) {
  setInterval(async () => {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@tanami.com' }
    });

    if (!adminUser) {
      console.error('Admin user not found. Skipping simulation.');
      return;
    }

    const simulatedStockPrice = (Math.random() * (500 - 100) + 100).toFixed(2);
    const action = 'simulated_stock_update';
    const amount = parseFloat(simulatedStockPrice);
    const opportunity = `Simulated Stock Price: $${simulatedStockPrice}`;

    try {
      const activity = await prisma.activity.create({
        data: {
          action,
          amount,
          opportunity,
          userId: adminUser.id,
        }
      });

      io.emit('new_activity', activity);
    } catch (err) {
      console.error("Error creating simulated activity:", err);
    }
  }, 10000);
}
