import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env, prisma } from ".";
import { RESTPostOAuth2AccessTokenWithBotAndWebhookIncomingScopeResult } from "discord-api-types/v10";

export default async (request: VercelRequest, response: VercelResponse) => {
  const exists = await prisma.dotdWebhook.findUnique({
    where: {
      linkingKey: request.query.state as string,
    },
  });
  if (!exists) {
    response.status(400).send("Invalid state");
    return;
  }
  if (exists.channelId) {
    response.status(400).send("Webhook already configured");
    return;
  }
  const webhookRequest = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.APPLICATION_ID,
      client_secret: env.SECRET,
      grant_type: "authorization_code",
      code: request.query.code as string,
      scope: "webhook.incoming",
      redirect_uri: `https://${env.SELF_URL}/api/dotd-webhook-callback`,
    }),
  });
  const webhook: RESTPostOAuth2AccessTokenWithBotAndWebhookIncomingScopeResult =
    await webhookRequest.json();
  console.log(webhook);
  await prisma.dotdWebhook.update({
    where: {
      linkingKey: request.query.state as string,
    },
    data: {
      channelId: webhook.webhook.channel_id,
      discordId: webhook.webhook.id,
      discordToken: webhook.webhook.token,
    },
  });

  response.status(200).send("Webhook set up successfully!");
};
