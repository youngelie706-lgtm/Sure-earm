import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userCtx = await verifyJwt(req);
  if (!userCtx) return res.status(401).json({ message: 'Unauthorized' });

  const user = await prisma.user.findUnique({ where: { id: userCtx.id } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const totalEarned = await prisma.transaction.aggregate({
    where: { userId: user.id, type: 'EARN' },
    _sum: { amountKobo: true }
  });

  const completedTasks = await prisma.taskCompletion.count({ where: { userId: user.id } });
  const referralCount = await prisma.user.count({ where: { referredById: user.id } });

  const recent = await prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10 });

  res.json({
    user: { id: user.id, email: user.email, name: user.name, balanceKobo: user.balanceKobo },
    stats: {
      totalEarnedKobo: totalEarned._sum.amountKobo || 0,
      completedTasks,
      referralCount,
      recent
    }
  });
}
