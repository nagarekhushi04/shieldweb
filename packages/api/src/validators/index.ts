import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const stellarAddressSchema = z
  .string()
  .length(56)
  .startsWith('G')
  .regex(/^[A-Z2-7]{56}$/, 'Invalid Stellar address format');

export const urlSchema = z
  .string()
  .url('Must be a valid URL')
  .max(2048, 'URL too long')
  .refine(url => {
    try { new URL(url); return true; } catch { return false; }
  }, 'Invalid URL format');

export const reportSchema = z.object({
  url: urlSchema,
  threatType: z.enum(['phishing', 'scam', 'malware', 'rug_pull', 'fake_wallet', 'other']),
  severity: z.number().int().min(1).max(4),
  description: z.string().max(1000).optional(),
  evidence: z.string().url().optional()
});

export const challengeSchema = z.object({
  walletAddress: stellarAddressSchema
});

export const verifySchema = z.object({
  walletAddress: stellarAddressSchema,
  signature: z.string().min(1),
  challenge: z.string().min(1)
});

// Middleware factory for zod validation
export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    // Update req.body with parsed/validated data (removes extra fields)
    req.body = result.data;
    next();
  };
}
