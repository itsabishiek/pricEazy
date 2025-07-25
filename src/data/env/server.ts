import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET: z.string(),
    STRIPE_STANDARD_PRICE_ID: z.string(),
    STRIPE_PRO_PRICE_ID: z.string(),
    STRIPE_ELITE_PRICE_ID: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    TEST_COUNTRY_CODE: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
