import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.post(Routes.applicationCommand(process.env.APPLICATION_ID), {
    body: {
        name: "quack",
        type: 1,
        description: "get a duck :)"
    }
})