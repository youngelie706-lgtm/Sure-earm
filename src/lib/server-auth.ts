import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function verifyJwt(req: NextApiRequest) {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.split(';').map(s=>s.trim()).find(c=>c.startsWith('session='));
  if (!match) return null;
  const token = match.split('=')[1];
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return null;
    return { id: user.id, email: user.email, isAdmin: user.isAdmin };
  } catch (err) {
    return null;
  }
}
