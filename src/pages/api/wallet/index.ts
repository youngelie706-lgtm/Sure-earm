import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyJwt(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    const txs = await prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    const withdrawals = await prisma.withdrawal.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    return res.json({ transactions: txs, withdrawals });
  }

  return res.status(405).end();
}
