const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('proof')
                .setDescription('The proof to ban the user.')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const allowedRoleIds = ['1296699699641712691']; // Add the role IDs here

            const hasRole = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));
            if (!hasRole) {
                return await interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    ephemeral: true
                });
            }

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const proof = interaction.options.getString('proof') || 'No proof provided';

            const embed = new EmbedBuilder()
                .setTitle('Banned')
                .setDescription(`Hello <@${user.id}>! You have been officially banned from Greenville Roleplay Native. The following reason and proof will be provided below. If you feel like this ban was unfair you can DM <@1114487029925937232> or <@1003382029200674900>`)
                .addFields([
                    { name: 'Reason', value: reason },
                    { name: 'Proof', value: proof }
                ])
                .setColor('#ff7d52');

            try {
                await user.send({ embeds: [embed] });
            } catch (error) {
                console.error(`Failed to send DM to ${user.tag}: ${error}`);
            }

            await interaction.guild.members.ban(user, { reason });

            // Log the ban in the specified channel
            const logChannel = await interaction.client.channels.fetch('1297599637867466783');
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('User Banned')
                    .setDescription(`User <@${user.id}> has been banned.`)
                    .addFields([
                        { name: 'Banned By', value: `<@${interaction.user.id}>` },
                        { name: 'Reason', value: reason },
                        { name: 'Proof', value: proof }
                    ])
                    .setColor('#ff7d52');

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error('Log channel not found.');
            }

            await interaction.reply({ content: `Successfully banned ${user.tag}`, ephemeral: true });
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'There was an error banning the user.', ephemeral: true });
        }
    },
};
