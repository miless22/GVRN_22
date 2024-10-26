// commands/economy/addmoney.js
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
        .setName('addmoney')
        .setDescription('Add money to a user\'s balance (Admins only).')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to add money to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to add')
                .setRequired(true)),
    
    async execute(interaction) {
        // Check if the user is an admin
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        // Check if the target user exists in the balances array
        let userBalance = userBalances.find(user => user.id === targetUser.id);
        
        // If the user does not exist, initialize their balance
        if (!userBalance) {
            userBalances.push({ id: targetUser.id, balance: amount });
        } else {
            // Add the specified amount to the user's balance
            userBalance.balance += amount;
        }

        // Save updated balances to the file
        fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');

        // Create an embed to confirm the transaction
        const embed = new EmbedBuilder()
        .setColor('#ff7d52')
            .setDescription(`Successfully added **${amount}** to **<@${interaction.user.id}>'s** balance.`)

        // Reply with the embed confirmation
        return interaction.reply({ embeds: [embed] });
    },
};
