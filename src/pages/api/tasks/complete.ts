import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';
import { z } from 'zod';

const bodySchema = z.object({ taskId: z.string(), proof: z.string().optional(), idempotencyKey: z.string().optional() });

// POST /api/tasks/complete
// body: { taskId, proof?, idempotencyKey? }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const user = await verifyJwt(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const parse = bodySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ message: 'Invalid request' });

  const { taskId, proof, idempotencyKey } = parse.data;

  // Validate task exists and is active
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || !task.active) return res.status(400).json({ message: 'Invalid task' });

  // Idempotency: if idempotencyKey provided and we've recorded it, return the existing completion/result
  if (idempotencyKey) {
    const existingByKey = await prisma.taskCompletion.findUnique({ where: { idempotencyKey } });
    if (existingByKey) {
      // If already rewarded, return rewarded status
      return res.json({ success: true, rewarded: existingByKey.rewarded, amountKobo: existingByKey.rewarded ? task.rewardKobo : 0 });
    }
  }

  // Attempt to create TaskCompletion with unique constraint to prevent double claim
  try {
    const completion = await prisma.taskCompletion.create({
      data: {
        userId: user.id,
        taskId: task.id,
        proof: proof || null,
        idempotencyKey: idempotencyKey || null
      },
    });

    // Server-side validation flow to mark rewarded:
    if (!task.requiresProof) {
      // Use a transaction to mark rewarded and create transaction record and update balance atomically
      await prisma.$transaction(async (tx) => {
        await tx.taskCompletion.update({
          where: { id: completion.id },
          data: {
            rewarded: true,
            rewardedAt: new Date()
          }
        });

        await tx.transaction.create({
          data: {
            userId: user.id,
            type: 'EARN',
            amountKobo: task.rewardKobo,
            meta: { taskId: task.id }
          }
        });

        await tx.user.update({
          where: { id: user.id },
          data: { balanceKobo: { increment: task.rewardKobo } }
        });
      });

      return res.json({ success: true, rewarded: true, amountKobo: task.rewardKobo });
    }

    // If proof required: return pending state
    return res.json({ success: true, rewarded: false, pending: true });
  } catch (err: any) {
    // Handle unique constraint when user already completed the task
    // Prisma error codes: P2002 for unique constraint
    if (err.code === 'P2002') {
      // Determine whether it's because of userId+taskId or idempotencyKey
      return res.status(409).json({ message: 'Task already completed by user or duplicate idempotency key' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
