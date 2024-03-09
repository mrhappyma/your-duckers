import { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "..";

export default async (request: VercelRequest, response: VercelResponse) => {
  const duck = await prisma.dotd.findFirst({
    orderBy: {
      sent: "desc",
    },
  });
  if (!duck) {
    response.status(500).send("No duck found");
    return;
  }
  response.status(200).send(duck);
};
