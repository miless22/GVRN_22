const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Initiates a session.')
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const allowedRoleId = '1296699710165225472'; // Replace with your staff role ID
            if (!interaction.member.roles.cache.has(allowedRoleId)) {
                return await interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    ephemeral: true
                });
            }

            const reactions = interaction.options.getInteger('reactions');
            const user = interaction.user;

            await interaction.reply({ content: `You Have Initiated A Session Successfully.`, ephemeral: true });

            const embed = new EmbedBuilder()
                .setTitle('Greenville Roleplay Native | Session Startup')
                .setDescription(`<@${user.id}> has initiated a roleplay session. Please ensure you have read our server information and roleplay infromation.
                    
                    For the session to commence the host needs **${reactions}**+`)
                    .setColor('#ff7d52')
                    .setImage("https://cdn.discordapp.com/attachments/1284822686467493898/1297605920435605575/Session_Startup_19.png?ex=6716892f&is=671537af&hm=7fc60f243636cf7697f0b4804bb57fcdde97ba2372a42d0e4c05bc1b203133f8&")
                    .setFooter({
                        text: 'Greenville Roleplay Native',
                        iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                    });

            const message = await interaction.channel.send({
                content: '@here',
                embeds: [embed],
            });

            await message.react('✅');

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Startup")
                .setDescription(`<@${interaction.user.id}> has initiated a roleplay session. The reactions have been set to ${reactions}.
                    
                    The command has been used in <#${interaction.channelId}>.`)
                    .setColor('#ff7d52')
                    .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096")
                    .setFooter({
                        text: 'Greenville Roleplay Native',
                        iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                    });

            const targetChannel = await interaction.client.channels.fetch('1297599637867466783');
            await targetChannel.send({ embeds: [newEmbed] });

            await interaction.editReply({ content: 'Session has been successfully initiated.', ephemeral: true });
        } catch (error) {
            console.error('Error starting session:', error);
            await interaction.reply({ content: 'There was an error initiating the session.', ephemeral: true });
        }
    },
};