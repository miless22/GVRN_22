const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinformation')
        .setDefaultMemberPermissions(0)
        .setDescription('Displays the server rules and information'),
    async execute(interaction) {
        // Acknowledge the interaction immediately
        await interaction.deferReply({ ephemeral: true });

        const image = "https://cdn.discordapp.com/attachments/1284822686467493898/1297568168134443008/Session_Startup_12.png?ex=671da646&is=671c54c6&hm=00818476247a57e808497fdc9dd4975a81f2a911b28ae8b48f008f484bcfdcca&";
        
        const targetChannelId = '1288800097563578368';
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return await interaction.editReply({ content: 'Channel not found!', ephemeral: true });
        }

        // Define each embed with detailed rules
        const embeds = [
            new EmbedBuilder()
                .setTitle(`Rules and Regulations`)
                .setDescription('Welcome to the Discord server! Here are the rules and regulations to ensure a safe and enjoyable environment for all members.')
                .setColor('#ff7d52'),
            new EmbedBuilder()
                .setTitle('Rule 1: Respect Everyone')
                .setDescription(`Please maintain a respectful attitude toward all RRE members as we strive to build a welcoming community within the Roblox roleplay industry. Disrespectful behavior may lead to a server ban.`)
                .setColor('#ff7d52'),
            new EmbedBuilder()
                .setTitle('Rule 2: Age Requirement')
                .setDescription(`To stay in this roleplay server, members must be at least 13 years old. Violators will be banned from the server.`)
                .setColor('#ff7d52'),
            new EmbedBuilder()
                .setTitle('Rule 3: Spamming')
                .setDescription(`Please refrain from spamming. Any spam messages will be deleted, and you will receive a warning.`)
                .setColor('#ff7d52'),
            new EmbedBuilder()
                .setTitle('Rule 4: Advertising')
                .setDescription(`Advertising in any channel is prohibited. If caught, you will receive a one-hour mute. Repeated violations may lead to more severe consequences.`)
                .setColor('#ff7d52'),
            new EmbedBuilder()
                .setTitle('Rule 5: NSFW')
                .setDescription(`NSFW content is strictly prohibited in this server. Posting any will result in an immediate server ban.`)
                .setColor('#ff7d52'),
            new EmbedBuilder()
                .setTitle('Rule 6: Staff Instructions')
                .setDescription(`To remain in the server, you must follow all staff instructions. This includes guidelines on behavior and properly carrying out any tasks as directed.`)
                .setColor('#ff7d52'),
            new EmbedBuilder()
                .setTitle('Rule 7: Discord and Roblox TOS')
                .setDescription(`Adhering to both Roblox and Discord’s Terms of Service is essential in this server. Failure to do so will result in consequences, up to and including removal from the server.`)
                .setColor('#ff7d52'),
        ];

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('server_information')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Roleplay Information',
                    description: 'Information for roleplaying.',
                    emoji: '<:car:1284846257621176331>',
                    value: 'rf',
                },
                {
                    label: 'Session Ping',
                    description: 'Collect the session ping role here.',
                    emoji: '<:alerts:1284846248980905995>',
                    value: 'sp',
                },
                {
                    label: 'Server Links',
                    description: 'View the server links',
                    emoji: '<:Appeals:1284845960098218087>',
                    value: 'sl',
                },
            ]);

        // Create action row for the select menu
        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Send all embeds and the select menu to the target channel
        await targetChannel.send({ files: [image], embeds, components: [row] });

        // Acknowledge the command
        await interaction.editReply({ content: 'Server rules have been sent to the channel.', ephemeral: true });
    },
};
