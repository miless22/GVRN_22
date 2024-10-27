const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const balancesFilePath = path.join('C:', 'Users', 'gamin', 'Documents', 'DiscordBots', 'GVRN Bot', 'data', 'eco', 'balances.json');

// Load user balances from the file
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    const data = fs.readFileSync(balancesFilePath, 'utf-8');
    userBalances = JSON.parse(data);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmoney')
        .setDescription('Add money to a user\'s balance (Admins only).')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to add money to (select @everyone to add to all)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to add')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (targetUser === null) {
            userBalances.forEach(userBalance => {
                userBalance.balance += amount;
            });

            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
            return interaction.reply({ content: `Successfully added **${amount}** to everyone's balance.` });
        }

        let userBalance = userBalances.find(user => user.id === targetUser.id);
        if (!userBalance) {
            userBalances.push({ id: targetUser.id, balance: amount });
        } else {
            userBalance.balance += amount;
        }

        fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
        return interaction.reply({ content: `Successfully added **${amount}** to **<@${targetUser.id}>'s** balance.` });
    },

    async executeMessage(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        const target = args[0];
        const amount = parseInt(args[1]);

        if (!target || isNaN(amount)) {
            return message.reply('Please provide a valid user or `@everyone` and an amount.');
        }

        if (target === '@everyone') {
            userBalances.forEach(userBalance => {
                userBalance.balance += amount;
            });

            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
            return message.reply(`Successfully added **${amount}** to everyone's balance.`);
        } else {
            const targetUser = message.mentions.users.first();
            if (!targetUser) {
                return message.reply('Please mention a valid user.');
            }

            let userBalance = userBalances.find(user => user.id === targetUser.id);
            if (!userBalance) {
                userBalances.push({ id: targetUser.id, balance: amount });
            } else {
                userBalance.balance += amount;
            }

            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
            return message.reply(`Successfully added **${amount}** to **<@${targetUser.id}>'s** balance.`);
        }
    },
};
