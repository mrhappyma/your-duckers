import { InteractionResponseType, verifyKey } from "discord-interactions";
import getRawBody from "raw-body";
import environmentVariables from "../utils/env";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import discordRequestHeaders from "../utils/discord-request-headers";
import quackCommand from "../commands/quack";
import dotdCommand from "../commands/dotd";
import infoCommand from "../commands/info";
import { PostHog } from "posthog-node";
import { APIInteraction, InteractionType } from "discord-api-types/v10";
import { PrismaClient } from "@prisma/client";

export const env = environmentVariables.parse(process.env);
export const hog = new PostHog(env.POSTHOG, {
  host: "https://app.posthog.com",
});
export const prisma = new PrismaClient();

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method === "POST") {
    // Verify the request
    const signature = request.headers["x-signature-ed25519"];
    const timestamp = request.headers["x-signature-timestamp"];
    const rawBody = await getRawBody(request);

    const headers = discordRequestHeaders.parse({ signature, timestamp });

    const isValidRequest = verifyKey(
      rawBody,
      headers.signature,
      headers.timestamp,
      env.PUBLIC_KEY
    );

    //if (!isValidRequest) {
     // console.error("Invalid Request");
     // return response.status(401).send({ error: "Bad request signature " });
    //}

    // Handle the request
    const message = request.body as APIInteraction;

    // Handle PINGs from Discord
    if (message.type === InteractionType.Ping) {
      console.log("Handling Ping request");
      response.send({
        type: InteractionResponseType.PONG,
      });
    } else if (message.type === InteractionType.ApplicationCommand) {
      // Handle our Slash Commands
      switch (message.data.name.toLowerCase()) {
        case "quack":
          return quackCommand(message, response);
        case "dotd":
          return dotdCommand(message, response);
        case "info":
          return infoCommand(response);
        default:
          console.error("Unknown Command");
          response.status(400).send({ error: "Unknown Type" });
          break;
      }
    } else {
      console.error("Unknown Type");
      response.status(400).send({ error: "Unknown Type" });
    }
  }
};
