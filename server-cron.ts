import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";

const prisma = new PrismaClient();

const trigger = "0 9 * * *"; // 9am every day
// const trigger = " * * * * *"; // every minute

new CronJob(
  trigger,
  async () => {
    const duck = await fetch("https://random-d.uk/api/v2/random");
    const duckJson: { url: string; message: string } = await duck.json();
    const allWebhooks = await prisma.dotdWebhook.findMany();

    for (const webhook of allWebhooks) {
      if (webhook.discordId && webhook.discordToken && webhook.channelId) {
        const webhookRequest = await fetch(
          `https://discord.com/api/webhooks/${webhook.discordId}/${webhook.discordToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: webhook.mentionRoleId
                ? `<@&${webhook.mentionRoleId}>`
                : undefined,
              embeds: [
                {
                  image: {
                    url: duckJson.url,
                  },
                },
              ],
            }),
          }
        );
        if (webhookRequest.status != 204) {
          await prisma.dotdWebhook.delete({
            where: {
              id: webhook.id,
            },
          });
          continue;
        }
      } else if (
        webhook.createdAt < new Date(Date.now() - 1000 * 60 * 60 * 2)
      ) {
        await prisma.dotdWebhook.delete({
          where: {
            id: webhook.id,
          },
        });
        continue;
      } else {
        continue;
      }
    }
  },
  null,
  true,
  "America/New_York"
);
