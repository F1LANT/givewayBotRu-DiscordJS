const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const TOKEN = 'ТОКЕН';
const CHANNEL_ID = 'ИД КАНАЛА';
const LOTTERY_FILE = 'lottery.json';
const LOTTERY_SETTINGS = 'lottery_settings.json';

let participants = new Set();
let lotteryEnd = null;
let lotteryMessage = null;
let settings = {};

client.once('ready', () => {
    console.log('Бот запущен!');
    loadSettings();
    const messageId = loadLotteryData();
    if (messageId) {
        const channel = client.channels.cache.get(CHANNEL_ID);
        channel.messages.fetch(messageId)
            .then(msg => {
                lotteryMessage = msg;
                continueLottery();
            })
            .catch(err => {
                console.error("Не удалось загрузить сообщение розыгрыша:", err);
                startLottery();
            });
    } else {
        startLottery();
    }
});

function loadSettings() {
    if (fs.existsSync(LOTTERY_SETTINGS)) {
        settings = JSON.parse(fs.readFileSync(LOTTERY_SETTINGS));
    } else {
        settings = { prize: '1000 MC', winners: 5, duration: 86400000 }; // Default values
        fs.writeFileSync(LOTTERY_SETTINGS, JSON.stringify(settings));
    }
}

function saveLotteryData() {
    const data = {
        endTime: lotteryEnd.toISOString(),
        participants: Array.from(participants),
        messageId: lotteryMessage?.id
    };
    fs.writeFileSync(LOTTERY_FILE, JSON.stringify(data));
}

function loadLotteryData() {
    if (fs.existsSync(LOTTERY_FILE)) {
        const savedData = JSON.parse(fs.readFileSync(LOTTERY_FILE));
        participants = new Set(savedData.participants);
        lotteryEnd = new Date(savedData.endTime);
        return savedData.messageId;
    }
    return null;
}

function startLottery() {
    lotteryEnd = new Date(Date.now() + settings.duration);
    sendLotteryMessage();
}

function continueLottery() {
    const timeLeft = lotteryEnd - Date.now();
    if (timeLeft > 0) {
        setTimeout(endLottery, timeLeft);
        updateLotteryMessage();
    } else {
        endLottery();
    }
}

function createLotteryEmbed(lastParticipant) {
    const endTimeStamp = Math.floor(lotteryEnd.getTime() / 1000);
    let description = `🏆 Приз: **${settings.prize}**\n👥 Количество победителей: **${settings.winners}**\n👋 Количество участников: **${participants.size}**\n⏰ Время окончания: <t:${endTimeStamp}:R>`;

    if (lastParticipant) {
        description += `\n🔷 Последний участник: <@${lastParticipant}>`;
    }

    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('🎉 Розыгрыш!')
        .setDescription(description)
        .setFooter({ text: 'Участвуйте сейчас!' });

    return embed;
}


function sendLotteryMessage() {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) return;

    const button = new ButtonBuilder()
        .setCustomId('participate')
        .setLabel('Участвовать')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    const embed = createLotteryEmbed();
    channel.send({ content: '@everyone Новый розыгрыш начался!', embeds: [embed], components: [row] }).then(msg => {
        lotteryMessage = msg;
        saveLotteryData();
    });
}

function updateLotteryMessage(lastParticipant) {
    if (!lotteryMessage) return;
    const embed = createLotteryEmbed(lastParticipant);
    lotteryMessage.edit({ embeds: [embed] });
}

function endLottery() {
    const winners = chooseWinners();
    const winnerMentions = winners.map(id => `<@${id}>`).join(', ');
    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('🎊 Розыгрыш завершен!')
        .setDescription(`🏅 Победители: ${winnerMentions}`);

    const channel = client.channels.cache.get(CHANNEL_ID);
    channel.send({ embeds: [embed] });
    participants.clear();
    lotteryMessage = null;
    startLottery();
}

function chooseWinners() {
    const participantsArray = Array.from(participants);
    const winners = [];
    for (let i = 0; i < settings.winners && participantsArray.length; i++) {
        const randomIndex = Math.floor(Math.random() * participantsArray.length);
        winners.push(participantsArray.splice(randomIndex, 1)[0]);
    }
    return winners;
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'participate') {
        try {
            // Отложить ответ на взаимодействие
            await interaction.deferReply({ ephemeral: true });

            const userId = interaction.user.id;

            if (participants.has(userId)) {
                // Пользователь уже участвует
                await interaction.editReply({ content: 'Вы уже участвуете в этом розыгрыше!' });
            } else {
                // Добавить пользователя в участники и обновить сообщение
                participants.add(userId);
                saveLotteryData();
                updateLotteryMessage(userId); // Обновить с указанием последнего участника
                await interaction.editReply({ content: 'Вы участвуете в розыгрыше!' });
            }

            // Установить таймер для удаления сообщения
            setTimeout(async () => {
                try {
                    await interaction.deleteReply();
                } catch (error) {
                    console.error('Ошибка при удалении сообщения:', error);
                }
            }, 5000);
        } catch (error) {
            console.error('Ошибка при обработке взаимодействия:', error);
        }
    }

    // ... [обработка других интеракций] ...
});




client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'endlottery') {
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            if (lotteryEnd && lotteryEnd > Date.now()) {
                await endLottery();
                await interaction.reply({ content: 'Розыгрыш завершен!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Сейчас нет активного розыгрыша.', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'У вас нет прав для выполнения этой команды.', ephemeral: true });
        }
    }
});

client.login(TOKEN);
