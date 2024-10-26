const { PermissionsBitField, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket22')
        .setDescription('Create a ticket'),

    async execute(interaction) {
        await interaction.reply({ content: 'Setting up ticket system...', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('Server Support')
            .setColor('#ff7d52')
            .setDescription(`
Please click the button below to create a ticket. Any troll tickets will lead to moderation action. Kindly wait for our staff team to assist you.`)
            .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096")
            .setImage("https://cdn.discordapp.com/attachments/1284822686467493898/1299383681655242792/Session_Startup_20.png?ex=671da99b&is=671c581b&hm=fe9da4feda2b803d06e97c12202e3498321f0e5d852c3161bd375fad652ab5ad&")
            .setFooter({
              text: 'Greenville Roleplay Native',
              iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
          });
        const button = new ButtonBuilder()
            .setCustomId('support')
            .setLabel('Create Ticket')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.channel.send({ embeds: [embed], components: [row] });

        await interaction.editReply({ content: 'Ticket system setup complete!', ephemeral: true });
    },
};
