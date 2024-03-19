import environmentVariables from "./utils/env";
import { REST } from "@discordjs/rest";
import {
  Routes,
} from "discord-api-types/v10";

const env = environmentVariables.parse(process.env);
const rest = new REST({ version: "10" }).setToken(env.TOKEN);

const commands = [
  {
    name: "quack",
    type: 1,
    description: "get a duck :)",
    integration_types: [0,1]
  },
  {
    name: "dotd",
    type: 1,
    description: "Set up the Duck of The Day",
    options: [
      {
        type: 8,
        name: "mention",
        description: "Role to mention when the DOTD is posted",
      },
    ],
    integration_types: [0],
    contexts: [0]
  },
  {
    name: "info",
    type: 1,
    description: "Learn about Duckers",
    integration_types: [0,1]
  },
];

rest.put(Routes.applicationCommands(env.APPLICATION_ID), {
  body: commands,
}).then(r => console.log(r))