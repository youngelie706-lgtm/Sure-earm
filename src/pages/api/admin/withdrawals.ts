import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';
import { z } from 'zod';

const bodySchema = z.object({ action: z.enum(['APPROVE','REJECT']), notes: z.string().optional(), withdrawalId: z.string() });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyJwt(req);
  if (!user || !user.isAdmin) return res.status(403).json({ message: 'Forbidden' });

  if (req.method === 'GET') {
    const withdrawals = await prisma.withdrawal.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true } });
    return res.json({ withdrawals });
  }

  if (req.method === 'POST') {
    const parse = bodySchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: 'Invalid request' });
    const { action, notes, withdrawalId } = parse.data;

    const w = await prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!w) return res.status(404).json({ message: 'Withdrawal not found' });

    if (w.status !== 'PENDING') return res.status(400).json({ message: 'Withdrawal is not pending' });

    if (action === 'REJECT') {
      // return funds to user
      await prisma.$transaction(async (tx) => {
        await tx.withdrawal.update({ where: { id: withdrawalId }, data: { status: 'REJECTED', notes: notes || null, processedAt: new Date() } });
        await tx.transaction.create({ data: { userId: w.userId, type: 'WITHDRAWAL_REVERSAL', amountKobo: -w.amountKobo * -1, meta: { withdrawalId } } });
        await tx.user.update({ where: { id: w.userId }, data: { balanceKobo: { increment: w.amountKobo } } });
      });
      return res.json({ success: true, status: 'REJECTED' });
    }

    // For APPROVE in demo, just mark PAID. In real integration, call payment provider then mark PAID on webhook.
    await prisma.withdrawal.update({ where: { id: withdrawalId }, data: { status: 'PAID', notes: notes || null, processedAt: new Date() } });
    return res.json({ success: true, status: 'PAID' });
  }

  return res.status(405).end();
}
