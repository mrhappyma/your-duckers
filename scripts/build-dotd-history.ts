import { PrismaClient } from "@prisma/client";
import {
  Client,
  GatewayIntentBits,
  Message,
  type TextBasedChannel,
} from "discord.js";

const serverId = process.env.SERVER!;
const channelId = process.env.CHANNEL!;
const userId = process.env.USERID!;
const token = process.env.TOKEN!;

const client = new Client({ intents: [GatewayIntentBits.MessageContent] });
const prisma = new PrismaClient();

client.on("ready", async () => {
  const server = await client.guilds.fetch(serverId);
  const channel = (await server?.channels.fetch(channelId)) as TextBasedChannel;
  const messages: Message[] = [];
  const getMessages = async (before?: string) => {
    const fetched = await channel.messages.fetch({ limit: 100, before });
    messages.push(...fetched.values());
    if (fetched.size === 100) {
      await getMessages(fetched.lastKey()!);
    }
  };
  await getMessages();
  console.log(`Fetched ${messages.length} messages`);

  messages.reverse();

  const dotds: { url: string; sent: Date }[] = [];
  for (const m of messages) {
    if (m.author.id != userId) continue;
    if (m.embeds.length != 1) continue;
    const embed = m.embeds[0];
    const url = embed.image?.url;
    if (!url) continue;
    dotds.push({ url, sent: m.createdAt });
  }

  console.log(`Fetched ${dotds.length} dotds`);
  await prisma.dotd.createMany({
    data: dotds.map((d) => ({ url: d.url, sent: d.sent })),
  });
  console.log(`Wrote ${dotds.length} dotds to database!`);
});

client.login(token);
