const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('session-rules')
        .setDefaultMemberPermissions(0)
        .setDescription('Displays the session rules and options.'),
    async execute(interaction) {
        // Define the target channel ID
        const targetChannelId = '1296699930110328865';

        // Fetch the channel using the client
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return interaction.reply({ content: 'Channel not found!', ephemeral: true });
        }

        const rulesEmbed = new EmbedBuilder()
            .setTitle('Roleplay Startup')
            .setImage("https://cdn.discordapp.com/attachments/1284822686467493898/1297584722691489853/Session_Startup_14.png?ex=67167571&is=671523f1&hm=28206b9b6b4bf9c1f02786f9397a6fc0672f0e5a0d602bd0b243e3ebab52927c&")
            .setDescription(`In this channel you would find the Greenville Roleplay Native staff team hosting roleplay sessions. Make sure to read the information provided at <#1288800097563578368> and the roleplay laws at <#1297589130548482048>.`)
            .setColor('#ff7d52');

        // Create a button for toggling the session ping role

        // Send the embed and the button to the specific channel
        await targetChannel.send({ embeds: [rulesEmbed],});

        // Optionally acknowledge the command to avoid timeout
        await interaction.reply({ content: 'Session rules sent to the channel.', ephemeral: true });
    },
};
