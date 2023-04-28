import environmentVariables from "./utils/env";

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const env = environmentVariables.parse(process.env);

const rest = new REST({ version: "10" }).setToken(env.TOKEN);

rest.put(Routes.applicationCommands(env.APPLICATION_ID), {
  body: [
    {
      name: "quack",
      type: 1,
      description: "get a duck :)",
    },
    {
      name: "dotd",
      type: 1,
      description: "Set up the Duck of The Day",
    },
    {
      name: "info",
      type: 1,
      description: "Learn about Duckers",
    },
  ],
});
