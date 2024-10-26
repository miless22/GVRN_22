const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const path = require('path');
const fs = require('fs');

const balancesFilePath = path.join('C:', 'Users', 'gamin', 'Documents', 'DiscordBots', 'GVRN Bot', 'data', 'eco', 'balances.json');

// Load user balances from the file
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    const data = fs.readFileSync(balancesFilePath, 'utf-8');
    userBalances = JSON.parse(data);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble a certain amount of your balance for a chance to win double.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to gamble')
                .setRequired(true)),

    async execute(interaction) {
        // Acknowledge the interaction immediately
        await interaction.deferReply({ ephemeral: true });

        const amount = interaction.options.getInteger('amount');
        const userId = interaction.user.id;

        // Find the user's balance entry
        const userBalanceEntry = userBalances.find(balance => balance.id === userId);

        // Check if the user balance entry exists
        if (!userBalanceEntry) {
            const embed = new EmbedBuilder()
                .setTitle('Balance Not Found')
                .setDescription('You do not have a balance entry. Please contact an admin.')
                .setColor('#FF0000'); // Red color for error

            return interaction.editReply({ embeds: [embed] });
        }

        // Check if the amount is valid
        if (amount <= 0) {
            const embed = new EmbedBuilder()
                .setTitle('Invalid Amount')
                .setDescription('You must gamble a positive amount.')
                .setColor('#FF0000'); // Red color for error

            return interaction.editReply({ embeds: [embed] });
        }

        if (amount > userBalanceEntry.balance) {
            const embed = new EmbedBuilder()
                .setTitle('Insufficient Balance')
                .setDescription('You cannot gamble more than your current balance.')
                .setColor('#FF0000'); // Red color for error

            return interaction.editReply({ embeds: [embed] });
        }

        // Determine the outcome (90% chance to lose, 10% chance to win)
        const outcome = Math.random() < 0.10; // 10% chance of winning

        // Log the outcome for debugging
        console.log(`Gamble outcome for ${userId}: ${outcome ? 'Win' : 'Lose'}`);

        // Update the balance based on the outcome
        if (outcome) {
            userBalanceEntry.balance += amount; // Win: double the amount
            const winEmbed = new EmbedBuilder()
                .setDescription(`You won! Your gamble of $${amount} has been doubled to $${userBalanceEntry.balance}. 🎉`)
                .setColor(Colors.Green);
            await interaction.editReply({ embeds: [winEmbed] });
        } else {
            userBalanceEntry.balance -= amount; // Lose: deduct the amount
            const loseEmbed = new EmbedBuilder()
                .setDescription(`You lost! Your gamble of $${amount} has been deducted from your balance. Your new balance is $${userBalanceEntry.balance}. 😢`)
                .setColor(Colors.Red);
            await interaction.editReply({ embeds: [loseEmbed] });
        }

        // Save the updated balances back to the file
        try {
            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
            console.log('Balances updated successfully.');
        } catch (writeError) {
            console.error('Error saving balances:', writeError);
        }
    },
};
