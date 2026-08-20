import { z } from 'zod';

export const withdrawSchema = z.object({ amountKobo: z.number().int().positive() });
export const completeTaskSchema = z.object({ taskId: z.string(), proof: z.string().optional(), idempotencyKey: z.string().optional() });
