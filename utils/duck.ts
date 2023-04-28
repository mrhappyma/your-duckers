import { z } from "zod";

const duckResponse = z.object({
  url: z.string(),
  message: z.string(),
});

export default duckResponse;
