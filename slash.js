const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const commands = [
    {
        name: 'endlottery',
        description: 'Завершить текущий розыгрыш'
    }
];

const rest = new REST({ version: '10' }).setToken("ТОКЕН");

(async () => {
    try {
        console.log('Начало регистрации слеш-команд (/) для бота.');

        await rest.put(
            Routes.applicationGuildCommands("ИД ПРИЛОЖЕНИЯ", "ИД СЕРВЕРА"),
            { body: commands },
        );

        console.log('Слеш-команды (/) успешно зарегистрированы для бота.');
    } catch (error) {
        console.error(error);
    }
})();
