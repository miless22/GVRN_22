const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkpoint')
        .setDefaultMemberPermissions(0)
        .setDescription('Check-in at the session checkpoint.'),
    async execute(interaction) {
        const pingEmbed = new EmbedBuilder()
            .setTitle('Session Checkpoint')
            .setDescription(`
Welcome to the session checkpoint! This is the designated area where you can confirm your presence to the session host. To ensure a smooth verification process, please follow the format outlined below:

**Host:** [Your Host's Name]  
**You:** [Your In-Game Name]

Your prompt and accurate check-in helps us maintain order during the session and ensures that all participants are accounted for. Thank you for your cooperation, and enjoy your roleplaying experience!

If you have any questions or require assistance, feel free to reach out to the staff team.
        `)
        .setColor('#ff7d52');

        await interaction.channel.send({ embeds: [pingEmbed] });
    },
};
