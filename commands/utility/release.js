const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('release')
        .setDescription('Releases the session for everyone to join.')
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('peacetime-status')
                .setDescription('Current peacetime status.')
                .addChoices(
                    { name: 'Peacetime On', value: 'On' },
                    { name: 'Peacetime Normal', value: 'Normal' },
                    { name: 'Peacetime Off', value: 'Off' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frp-speed')
                .setDescription('FRP speeds.')
                .addChoices(
                    { name: '60', value: '60' },
                    { name: '70', value: '70' },
                    { name: '80 (should not be used frequently)', value: '80' }
                )
                .setRequired(true)),

    async execute(interaction) {
        try {
            // Check if the user has the required role
            const staffRoleId = '1296699710165225472'; // Replace with your staff role ID
            if (!interaction.member.roles.cache.has(staffRoleId)) {
                return await interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    ephemeral: true
                });
            }

            const sessionLink = interaction.options.getString('session-link');
            const peacetimeStatus = interaction.options.getString('peacetime-status');
            const frpSpeed = interaction.options.getString('frp-speed');

            const embed = new EmbedBuilder()
                .setTitle('Greenville Roleplay Native | Session Release')
                .setDescription(`> The session is now open. Detailed information regarding the session is provided below. To join, please click the button below to receive the session link.\n\n**__Session Information__**\n> Session Host: <@${interaction.user.id}>\n> FRP Speed: ${frpSpeed}\n> Peacetime: ${peacetimeStatus}\n\nNote: Leaking the session would result in a server ban.`)
                .setColor('#ff7d52')
                .setImage("https://cdn.discordapp.com/attachments/1284822686467493898/1297603578097041490/Session_Startup_18.png?ex=67168701&is=67153581&hm=f9efeefef7d16e4e3041664fad62695821f4c3ca6c523a4f61fc57db85753ce2&")
                .setFooter({
                    text: 'Greenville Roleplay Native',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                });

            const button = new ButtonBuilder()
                .setLabel('Session Link')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('session_link_button'); // Ensure a unique and clear customId

            const row = new ActionRowBuilder()
                .addComponents(button);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Release")
                .setDescription(`<@${interaction.user.id}> has released their session. The information below is the session information.\n**FRP:** ${frpSpeed}\n**Peacetime:** ${peacetimeStatus}\n**Link**: ${sessionLink}\n\nCommand used in <#${interaction.channelId}>.`)
                .setColor('#ff7d52')
                    .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096")
                    .setFooter({
                        text: 'Greenville Roleplay Native',
                        iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                    });

            const logChannel = await interaction.client.channels.fetch('1297599637867466783');
            await logChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ content: '@here', embeds: [embed], components: [row] });

            await interaction.reply({ content: 'You have successfully released the session.', ephemeral: true });

            // Button interaction collector
            const filter = i => i.customId === 'session_link_button';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, max: 1, time: 60000 }); // Max 1 collection

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();
                    await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });

                    const logEmbed = new EmbedBuilder()
                        .setTitle(`Session Link Button`)
                        .setDescription(`Button clicked by <@${i.user.id}>.`)
                        .setColor('#ff7d52')
                    .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096")
                    .setFooter({
                        text: 'Greenville Roleplay Native',
                        iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                    });

                    await logChannel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    console.log('No interactions collected.');
                } else {
                    console.log(`Collected ${collected.size} interaction.`);
                }
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
