import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextApiResponse } from 'next';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function hashPassword(plaintext: string) {
  const saltRounds = 12;
  return bcrypt.hash(plaintext, saltRounds);
}

export async function verifyPassword(plaintext: string, hash: string) {
  return bcrypt.compare(plaintext, hash);
}

export function signJwt(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function setSessionCookie(res: NextApiResponse, token: string) {
  const cookie = serialize('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  res.setHeader('Set-Cookie', cookie);
}

export function clearSessionCookie(res: NextApiResponse) {
  const cookie = serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  res.setHeader('Set-Cookie', cookie);
}
