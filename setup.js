const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const dotenv = require("dotenv");

dotenv.config();
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
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
    ],
});
