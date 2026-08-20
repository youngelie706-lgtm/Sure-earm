import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { verifyJwt } from '../../../lib/server-auth';
import { z } from 'zod';

const createSchema = z.object({ title: z.string().min(3), description: z.string().min(3), category: z.string().optional(), rewardKobo: z.number().int().positive(), requiresProof: z.boolean().optional(), active: z.boolean().optional() });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyJwt(req);
  if (!user || !user.isAdmin) return res.status(403).json({ message: 'Forbidden' });

  if (req.method === 'POST') {
    const parse = createSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ message: 'Invalid request' });
    const data = parse.data;

    const task = await prisma.task.create({ data: {
      title: data.title,
      description: data.description,
      category: data.category || 'general',
      rewardKobo: data.rewardKobo,
      requiresProof: data.requiresProof || false,
      active: data.active ?? true
    } });

    return res.json({ task });
  }

  if (req.method === 'GET') {
    const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ tasks });
  }

  return res.status(405).end();
}
