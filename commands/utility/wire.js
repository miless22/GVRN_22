// commands/economy/wire.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the balances file
const balancesFilePath = path.join('C:', 'Users', 'gamin', 'Documents', 'DiscordBots', 'GVRN Bot', 'data', 'eco', 'balances.json');

// Load user balances from the file
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    const data = fs.readFileSync(balancesFilePath, 'utf-8');
    userBalances = JSON.parse(data);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wire')
        .setDescription('Wire money to another user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to wire money to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to wire')
                .setRequired(true)),
    
    async execute(interaction) {
        const senderId = interaction.user.id;
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        // Check if the sender exists in the balances array
        let senderBalance = userBalances.find(user => user.id === senderId);
        if (!senderBalance) {
            return interaction.reply({ content: 'You do not have a balance yet. Please use `/work` to start earning.', ephemeral: true });
        }

        // Check if the target user exists in the balances array
        let receiverBalance = userBalances.find(user => user.id === targetUser.id);
        if (!receiverBalance) {
            // If the receiver does not exist, initialize their balance
            userBalances.push({ id: targetUser.id, balance: 0 });
            receiverBalance = userBalances.find(user => user.id === targetUser.id);
        }

        // Check if sender has enough balance
        if (senderBalance.balance < amount) {
            return interaction.reply({ content: 'You do not have enough balance to complete this transaction.', ephemeral: true });
        }

        // Process the wire transfer
        senderBalance.balance -= amount;
        receiverBalance.balance += amount;

        // Save updated balances to the file
        fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');

        // Create an embed to confirm the transaction and ping the user
        const embed = new EmbedBuilder()
            .setColor('#ff7d52')
            .setDescription(`Successfully wired **${amount}** coins to <@${targetUser.id}>.`); // Pinging the receiver

        // Reply with the embed confirmation
        return interaction.reply({ embeds: [embed] });
    },
};
