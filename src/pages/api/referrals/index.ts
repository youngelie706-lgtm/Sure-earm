import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyJwt(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    const referrals = await prisma.user.findMany({ where: { referredById: user.id }, orderBy: { createdAt: 'desc' } });
    const referralTransactions = await prisma.transaction.findMany({ where: { userId: user.id, type: 'REFERRAL' } });
    return res.json({ referrals, referralTransactions });
  }

  return res.status(405).end();
}
