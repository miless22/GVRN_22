const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('over')
        .setDescription('Excute this command to end your roleplay session.')
        .addStringOption(option =>
            option.setName('start-time')
                .setDescription('Start time in HH:MM format')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end-time')
                .setDescription('End time in HH:MM format')
                .setRequired(true)),
    async execute(interaction) {
        const staffRoleId = '1296699710165225472'; // Replace with your staff role ID
        if (!interaction.member.roles.cache.has(staffRoleId)) {
            return await interaction.reply({
                content: 'You do not have the required role to use this command.',
                ephemeral: true
            });
        }

        const startTime = interaction.options.getString('start-time');
        const endTime = interaction.options.getString('end-time');

        const now = new Date();
        const start = new Date(now);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        start.setHours(startHours, startMinutes, 0, 0);

        const end = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHours, endMinutes, 0, 0);

        if (start > end) {
            end.setDate(end.getDate() + 1); // Adjust end time if it's past midnight
        }

        try {
            await interaction.reply({ content: 'Processing your request...', ephemeral: true });

            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            const messagesToDelete = sortedMessages.filter((msg, index) => {
                const msgDate = new Date(msg.createdTimestamp);
                return index >= 2 && msgDate >= start && msgDate <= end;
            });

            for (const msg of messagesToDelete.values()) {
                try {
                    await msg.delete();
                } catch (deleteError) {
                    // Handle individual message deletion errors silently
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('Greenville Roleplay Native | Session Concluded')
                .setDescription(`> Thank you for joining the Greenville Roleplay Native session. We are looking forward to seeing you again!

                **__Session Details:__**
                > Host: **<@${interaction.user.id}>**
                > Start Time: **${startTime}**
                > End Time: **${endTime}**`)
                .setColor('#ff7d52')
                .setImage("https://cdn.discordapp.com/attachments/1284822686467493898/1297601995577884742/Session_Startup_17.png?ex=67168588&is=67153408&hm=2eb7dbc5738ca01b53379955dac815e75b0783329188fe5131aa2d3bb662a62c&")
                .setFooter({
                    text: 'Greenville Roleplay Native',
                    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                });

            await interaction.channel.send({ embeds: [embed] });

            // Send an embed to the specific channel213123
            const sessionEndEmbed = new EmbedBuilder()
                .setTitle('Session Ended')
                .setDescription(`<@${interaction.user.id}> has ended their session.
                    
                    Command used in <#${interaction.channelId}>.
                    Start Time : ${startTime}
                    End Time: ${endTime}`)
                    .setColor('#ff7d52')
                    .setThumbnail("https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096")
                    .setFooter({
                        text: 'Greenville Roleplay Native',
                        iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                    });

            const logChannel = interaction.client.channels.cache.get('1297599637867466783');
            if (logChannel) {
                await logChannel.send({ embeds: [sessionEndEmbed] });
            }

            await interaction.editReply({ content: 'Command processed successfully.', ephemeral: true });
        } catch (error) {
            try {
                if (!interaction.replied) {
                    await interaction.reply({ content: 'Failed to process the command. Please try again later.', ephemeral: true });
                } else {
                    await interaction.followUp({ content: 'Failed to process the command. Please try again later.', ephemeral: true });
                }
            } catch (replyError) {
                // Handle reply errors silently
            }
        }
    },
};
