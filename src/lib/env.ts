import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL starting with mysql://'),

  SMTP_HOST: z.string().min(1, 'SMTP_HOST cannot be empty'),

  SMTP_PORT: z.coerce.number().int().positive('SMTP_PORT must be a positive integer'),

  SMTP_SECURE: z.preprocess((val) => val === 'true' || val === true || val === '1', z.boolean()),

  SMTP_USER: z.string().default(''),

  SMTP_PASS: z.string().default(''),

  SMTP_FROM: z.string().min(1, 'SMTP_FROM cannot be empty'),

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z.coerce.number().int().positive().default(3000),

  APP_SECRET: z.string().min(12, 'APP_SECRET must be at least 12 characters long'),

  STRIPE_SECRET_KEY: z.string().default(''),

  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().default(''),

  STRIPE_WEBHOOK_SECRET: z.string().default(''),
});

// Avoid executing this validation in the browser bundle
let env: z.infer<typeof envSchema>;

if (typeof window === 'undefined') {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    throw new Error('Invalid configuration. Please fix the environment variables listed above.');
  }

  env = parsed.data;
} else {
  // Return dummy env on client to satisfy type checking without disclosing values
  env = {} as unknown as z.infer<typeof envSchema>;
}

export { env };
