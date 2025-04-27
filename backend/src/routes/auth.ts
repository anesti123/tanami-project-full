import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Check if the admin user exists when the app starts
const checkAdminUser = async () => {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@tanami.com' },
  });

  if (!admin) {
    const hashedPassword = bcrypt.hashSync('admin', 10); // Password for the admin
    await prisma.user.create({
      data: {
        email: 'admin@tanami.com',
        password: hashedPassword,
      },
    });
    console.log('Admin user created');
  }
};

// Call the function to check for the admin user
checkAdminUser();

// Register user
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password and create user
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword }
  });
  res.json({ message: 'User registered' });
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Compare password
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRATION || '1h' });
  res.json({ token });
});

export default router;
