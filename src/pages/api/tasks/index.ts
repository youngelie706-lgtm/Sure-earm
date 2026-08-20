import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyJwt(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    const tasks = await prisma.task.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
    return res.json(tasks.map(t => ({ ...t, reward: `₦${(t.rewardKobo/100).toFixed(2)}` })));
  }

  return res.status(405).end();
}
