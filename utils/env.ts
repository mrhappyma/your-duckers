import { z } from "zod";

const environmentVariables = z.object({
  TOKEN: z.string(),
  PUBLIC_KEY: z.string(),
  APPLICATION_ID: z.string(),
  POSTHOG: z.string(),
  DATABASE_URL: z.string(),
  VERCEL_URL: z.string(),
  SECRET: z.string(),
});

export default environmentVariables;
