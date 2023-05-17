import environmentVariables from "./utils/env";
import { REST } from "@discordjs/rest";
import {
  type RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from "discord-api-types/v10";

const env = environmentVariables.parse(process.env);
const rest = new REST({ version: "10" }).setToken(env.TOKEN);

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  {
    name: "quack",
    type: 1,
    description: "get a duck :)",
  },
  {
    dm_permission: false,
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
  },
  {
    name: "info",
    type: 1,
    description: "Learn about Duckers",
  },
];

rest.put(Routes.applicationCommands(env.APPLICATION_ID), {
  body: commands,
});
