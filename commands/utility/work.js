// commands/economy/work.js
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
        .setName('work')
        .setDescription('Work to earn some money!'),
    
    async execute(interaction) {
        const userId = interaction.user.id;

        // Check if the user exists in the balances array
        let userBalance = userBalances.find(user => user.id === userId);
        
        // If the user does not exist, initialize their balance
        if (!userBalance) {
            userBalances.push({ id: userId, balance: 0 });
            userBalance = userBalances.find(user => user.id === userId);
        }

        // Generate a random amount of money to earn between 10 and 100
        const amountEarned = Math.floor(Math.random() * (100 - 10 + 1)) + 10;

        // Add the earned amount to the user's balance
        userBalance.balance += amountEarned;

        // Save updated balances to the file
        fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');

        // Create an embed to confirm the earnings
        const embed = new EmbedBuilder()
        .setColor('#ff7d52')
            .setDescription(`You worked hard and earned **${amountEarned}**!`)

        // Reply with the embed confirmation
        return interaction.reply({ embeds: [embed] });
    },
};
