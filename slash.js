const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const commands = [
    {
        name: 'endlottery',
        description: 'Завершить текущий розыгрыш'
    }
];

const rest = new REST({ version: '10' }).setToken("MTE3NTk1NTY4MDU2MjI1Mzg1NA.GeTLsg.zGElUH78VltdRjh6IbW17yCLJp_rHKAvrh5Frc");

(async () => {
    try {
        console.log('Начало регистрации слеш-команд (/) для бота.');

        await rest.put(
            Routes.applicationGuildCommands("1175955680562253854", "1169194180703166464"),
            { body: commands },
        );

        console.log('Слеш-команды (/) успешно зарегистрированы для бота.');
    } catch (error) {
        console.error(error);
    }
})();