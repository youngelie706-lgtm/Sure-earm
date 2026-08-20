import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';
import { nanoid } from 'nanoid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password, name, referralCode } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await hashPassword(password);
    const code = (nanoid(8)).toUpperCase();

    const data: any = { email, passwordHash, name: name || null, referralCode: code };
    if (referralCode) {
      const ref = await prisma.user.findUnique({ where: { referralCode } });
      if (ref) data.referredById = ref.id;
    }

    const user = await prisma.user.create({ data });
    return res.status(201).json({ id: user.id, email: user.email, referralCode: user.referralCode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
