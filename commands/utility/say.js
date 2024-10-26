const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to send.')
                .setRequired(true)
        )
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to send the message to.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const targetChannel = interaction.options.getChannel('channel') || interaction.channel;

        try {
            await targetChannel.send(message);
            await interaction.reply({ content: 'Message sent!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error sending the message.', ephemeral: true });
        }
    }
};
