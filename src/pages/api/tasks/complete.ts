import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const user = await verifyJwt(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  const { taskId, proof } = req.body;
  if (!taskId) return res.status(400).json({ message: 'Missing taskId' });

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || !task.active) return res.status(400).json({ message: 'Invalid task' });

  try {
    const completion = await prisma.taskCompletion.create({
      data: { userId: user.id, taskId: task.id, proof: proof || null }
    });

    if (!task.requiresProof) {
      await prisma.$transaction(async (tx) => {
        await tx.taskCompletion.update({ where: { id: completion.id }, data: { rewarded: true, rewardedAt: new Date() } });
        await tx.transaction.create({ data: { userId: user.id, type: 'EARN', amountKobo: task.rewardKobo, meta: { taskId: task.id } } });
        await tx.user.update({ where: { id: user.id }, data: { balanceKobo: { increment: task.rewardKobo } } });
      });
      return res.json({ success: true, rewarded: true, amountKobo: task.rewardKobo });
    }

    return res.json({ success: true, rewarded: false, pending: true });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Task already completed by user' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
