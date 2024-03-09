import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const webhooks = await client.dotdWebhook.findMany({});

const outPath = "./out/webhooks.json";
const fs = require("fs");
fs.writeFileSync(outPath, JSON.stringify(webhooks, null, 4));
console.log(`Wrote ${webhooks.length} webhooks to ${outPath}`);
