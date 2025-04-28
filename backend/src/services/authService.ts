import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@tanami.com' },
  });
  if (!admin) {
    const hashedPassword = bcrypt.hashSync('admin', 10);
    await prisma.user.create({
      data: {
        email: 'admin@tanami.com',
        password: hashedPassword,
      },
    });
    console.log('Admin user created');
  }
})();

export const registerUser = async ({ email, password }: { email: string, password: string }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { status: 400, body: { message: 'User already exists' } };
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  await prisma.user.create({ data: { email, password: hashedPassword } });

  return { status: 201, body: { message: 'User registered' } };
};

export const loginUser = async ({ email, password }: { email: string, password: string }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { status: 401, body: { message: 'Invalid credentials' } };

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return { status: 401, body: { message: 'Invalid credentials' } };

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  });

  return { status: 200, body: { token } };
};
