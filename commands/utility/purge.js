const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified number of messages')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator) // Use 'ManageMessages' for more appropriate permission
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of messages to delete')
                .setRequired(true)),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        // Check if the amount is within the valid range
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'You need to input a number between 1 and 100.', ephemeral: true });
        }

        // Attempt to bulk delete messages
        try {
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);
            return interaction.reply({ content: `Successfully deleted ${deletedMessages.size} messages.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error trying to purge messages in this channel!', ephemeral: true });
        }
    },
};

