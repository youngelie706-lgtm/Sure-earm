import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyJwt(req);
  if (!user || !user.isAdmin) return res.status(403).json({ message: 'Forbidden' });

  if (req.method === 'GET') {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ users });
  }

  return res.status(405).end();
}
