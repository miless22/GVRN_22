const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botprofile')
        .setDescription('Displays information about the bot.'),

    async execute(interaction) {
        // Bot information
        const botName = interaction.client.user.username;
        const botVersion = '1.1.1'; // Update this if you release new versions
        const botLatency = `${Math.round(interaction.client.ws.ping)}ms`; // Fetching the bot latency

        // Create the embed
        const botProfileEmbed = new EmbedBuilder()
            .setTitle(`${botName} Profile`)
            .setDescription(`
                **Name:** ${botName}
                **Contributers:** [Jaxon](https://guns.lol/jaxon.yo)
                **Latency:** ${botLatency}
                **Version:** ${botVersion}
            `)
            .setColor('#ff7d52')
            .setFooter({
                text: `Bot Information`,
            });

        // Send the embed
        await interaction.reply({ embeds: [botProfileEmbed] });
    },
};
