// commands/economy/balance.js
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
        .setName('balance')
        .setDescription('Check your current balance or another user\'s balance.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to check the balance of')),
    
    async execute(interaction) {
        // Get the user from the command option, or default to the command user
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const userId = targetUser.id;

        // Check if the user exists in the balances array
        const userBalance = userBalances.find(user => user.id === userId);
        
        // Create an embed to reply with the user's balance
        const embed = new EmbedBuilder()
            .setColor('#ff7d52')
            .setThumbnail(targetUser.displayAvatarURL()) // Use targetUser to get avatar URL
            .setDescription(`**${targetUser.username}'s** Cash: **${userBalance ? userBalance.balance : 0}**`); // Fixed user reference

        // Reply with the embed
        return interaction.reply({ embeds: [embed] });
    },
};
