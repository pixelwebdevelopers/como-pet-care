import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/como_pet_care',
  },
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
});

