import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

// For demonstration, using an in-memory list (use Prisma in production)
let users: any[] = [
  {
    id: 1,
    email: 'admin@tanami.com',
    password: bcrypt.hashSync('password', 10)
  }
];

router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashed = bcrypt.hashSync(password, 10);
  const newUser = { id: users.length + 1, email, password: hashed };
  users.push(newUser);
  res.json({ message: 'User registered' });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRATION || '1h' });
  res.json({ token });
});

export default router;
