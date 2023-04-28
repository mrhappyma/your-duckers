import { z } from "zod";

const discordRequestHeaders = z.object({
  signature: z.string(),
  timestamp: z.string(),
});

export default discordRequestHeaders;
