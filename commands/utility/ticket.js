const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const path = require('path');
const fs = require('fs');

const ticketsDirPath = path.join(__dirname, '../../data/tickets');
const balancesFilePath = path.join('C:', 'Users', 'gamin', 'Documents', 'DiscordBots', 'GVRN Bot', 'data', 'eco', 'balances.json');

// Ensure the tickets directory exists
if (!fs.existsSync(ticketsDirPath)) {
    fs.mkdirSync(ticketsDirPath, { recursive: true });
}

// Load user balances from the file
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    const data = fs.readFileSync(balancesFilePath, 'utf-8');
    userBalances = JSON.parse(data);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a new ticket.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user for whom the ticket is being created.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('offense')
                .setDescription('The offense for the ticket')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('price')
                .setDescription('The price for the ticket')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('The count for the ticket')
                .setRequired(true)),

    async execute(interaction) {
        // Acknowledge the interaction immediately
        await interaction.deferReply({ ephemeral: true });

        // Role IDs that are allowed to use this command
        const allowedRoleIds = ['1296699735352021042', '1296699716196765788'];

        // Check if the user has one of the allowed roles
        const hasRole = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));

        if (!hasRole) {
            const embed = new EmbedBuilder()
                .setTitle('Role Not Found')
                .setDescription('You do not have permission to use this command.')
                .setColor('#FF0000'); // Red color for error

            return interaction.editReply({ embeds: [embed] });
        }

        const user = interaction.options.getUser('user');
        const offense = interaction.options.getString('offense');
        const price = interaction.options.getInteger('price');
        const count = interaction.options.getInteger('count');
        const userId = user.id;

        // Load user balance for the interaction user
        const userBalanceEntry = userBalances.find(balance => balance.id === interaction.user.id);

        // Log the user's balance entry for debugging
        console.log(`User Balance Entry:`, userBalanceEntry);

        // Check if the user balance entry exists
        if (!userBalanceEntry) {
            const embed = new EmbedBuilder()
                .setTitle('Balance Not Found')
                .setDescription('You do not have a balance entry. Please contact an admin.')
                .setColor('#FF0000'); // Red color for error

            return interaction.editReply({ embeds: [embed] });
        }

        // Log the current balance before deduction
        console.log(`Current balance before deduction: ${userBalanceEntry.balance}`);

        // Deduct the ticket price from the user's balance, allowing negative balance
        userBalanceEntry.balance -= price;

        // Log the new balance after deduction
        console.log(`New balance after deduction: ${userBalanceEntry.balance}`);

        // Save the updated balances back to the file
        try {
            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
            console.log('Balances updated successfully.');
        } catch (writeError) {
            console.error('Error saving balances:', writeError);
        }

        const ticketFilePath = path.join(ticketsDirPath, `${userId}.json`);

        try {
            // Prepare the ticket data
            const ticketData = {
                offense,
                price,
                count,
                date: new Date()
            };

            // Load existing tickets if they exist, else start a new array
            let tickets = [];
            if (fs.existsSync(ticketFilePath)) {
                try {
                    tickets = JSON.parse(fs.readFileSync(ticketFilePath, 'utf8'));
                } catch (readError) {
                    console.error('Error reading the ticket file:', readError);
                    return interaction.editReply({ content: 'Failed to read existing tickets. Please try again later.', ephemeral: true });
                }
            }

            // Add new ticket
            tickets.push(ticketData);

            // Write the updated tickets array to the file
            try {
                fs.writeFileSync(ticketFilePath, JSON.stringify(tickets, null, 2), 'utf8');
            } catch (writeError) {
                console.error('Error writing the ticket file:', writeError);
                return interaction.editReply({ content: 'Failed to save the ticket. Please try again later.', ephemeral: true });
            }

            // Send DM to the user about the ticket
            try {
                const dmEmbed = new EmbedBuilder()
                    .setDescription(`You have been given a ticket for ${offense} and $${price} has been removed from your balance. If you feel like this is unfair please contact the EMS Department.`)
                    .setColor(Colors.Yellow);

                await user.send({ embeds: [dmEmbed] });
            } catch (dmError) {
                console.error(`Error sending DM to user ${userId}: DMs are off or user cannot be messaged.`);
            }

            const replyEmbed = new EmbedBuilder()
                .setDescription(`The ticket for <@${userId}> has been created successfully.`)
                .setColor('#f1efef');

            await interaction.editReply({ embeds: [replyEmbed] });
        } catch (error) {
            console.error('Error executing the ticket command:', error);
            return interaction.editReply({ content: 'An error occurred while creating the ticket. Please try again later.' });
        }
    },
};
