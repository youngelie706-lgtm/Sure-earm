import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyJwt(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method !== 'POST') return res.status(405).end();

  const { amountKobo } = req.body;
  if (!amountKobo || typeof amountKobo !== 'number') return res.status(400).json({ message: 'Invalid amount' });

  // create withdrawal if balance sufficient
  const u = await prisma.user.findUnique({ where: { id: user.id } });
  if (!u) return res.status(404).json({ message: 'User not found' });
  if (u.balanceKobo < amountKobo) return res.status(400).json({ message: 'Insufficient balance' });

  try {
    await prisma.$transaction(async (tx) => {
      await tx.withdrawal.create({ data: { userId: user.id, amountKobo, status: 'PENDING' } });
      await tx.transaction.create({ data: { userId: user.id, type: 'WITHDRAWAL', amountKobo: -amountKobo, meta: { note: 'Withdrawal request (demo)' } } });
      await tx.user.update({ where: { id: user.id }, data: { balanceKobo: { decrement: amountKobo } } });
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
