import { z } from "zod";

export const reqInput = z.object({
  source_language: z.number(),
  content: z.string(),
  target_language: z.number(),
});