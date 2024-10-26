const { SlashCommandBuilder, EmbedBuilder, Colors, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infraction')
        .setDescription('Log an infraction for a member and assign appropriate roles')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The member to apply the infraction to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('The infraction level (1, 2, or 3)')
                .setRequired(true)
                .addChoices(
                    { name: '1', value: 1 },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 }
                ))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the infraction')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('proof')
                .setDescription('Proof of the infraction (e.g. link to screenshot)')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const allowedRoleId = '1296699710165225472'; // Replace with allowed role ID
            if (!interaction.member.roles.cache.has(allowedRoleId)) {
                return await interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    ephemeral: true
                });
            }

            const targetMember = interaction.options.getMember('member');
            const infractionLevel = interaction.options.getInteger('level');
            const reason = interaction.options.getString('reason');
            const proof = interaction.options.getString('proof') || 'No proof provided';

            const infractionRole1 = '1296699729819865158';
            const infractionRole2 = '1296699728888598540';
            const infractionRole3 = '1296699727940943902';

            let assignedRole;

            if (infractionLevel === 1) {
                assignedRole = interaction.guild.roles.cache.get(infractionRole1);
            } else if (infractionLevel === 2) {
                assignedRole = interaction.guild.roles.cache.get(infractionRole2);
            } else if (infractionLevel === 3) {
                assignedRole = interaction.guild.roles.cache.get(infractionRole3);
            }

            if (assignedRole) {
                await targetMember.roles.add(assignedRole);
                await interaction.reply({
                    content: `Assigned infraction level ${infractionLevel} to ${targetMember.displayName}`,
                    ephemeral: true
                });
            } else {
                return await interaction.reply({
                    content: `Role for infraction level ${infractionLevel} not found.`,
                    ephemeral: true
                });
            }

            const dmEmbed = new EmbedBuilder()
                .setTitle('Infraction Notice')
                .setDescription('You have been given an infraction for the following reason:')
                .addFields(
                    { name: 'Level', value: `${infractionLevel}`, inline: true },
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Proof', value: proof }
                )
                .setColor('#ff7d52');

            try {
                await targetMember.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error(`Failed to send DM to ${targetMember.user.tag}: ${error}`);
            }

            // Log the infraction in the specified channel
            const logChannel = await interaction.client.channels.fetch('1297599637867466783');
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('Infraction Logged')
                    .setDescription(`Infraction logged for <@${targetMember.id}>.`)
                    .addFields([
                        { name: 'Infraction Level', value: `${infractionLevel}`, inline: true },
                        { name: 'Assigned By', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Reason', value: reason },
                        { name: 'Proof', value: proof }
                    ])
                    .setColor('#ff7d52');

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error('Log channel not found.');
            }

            await interaction.editReply({
                content: `Infraction successfully logged for ${targetMember.displayName}.`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error logging infraction:', error);
            await interaction.reply({ content: 'There was an error logging the infraction.', ephemeral: true });
        }
    },
};
