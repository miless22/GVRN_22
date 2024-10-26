const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('earlyaccess')
    .setDescription('Grant early access to a user with a link')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('The link for early access')
        .setRequired(true)),
  async execute(interaction) {
    try {
      const staffRoleId = '1296699710165225472'; // Only users with this role can execute the command

      // Check if the user has the required role
      if (!interaction.member.roles.cache.has(staffRoleId)) {
        // If the user doesn't have the required role, reply with a permission error
        return await interaction.reply({ content: 'You do not have permission to execute this command.', ephemeral: true });
      }

      // Acknowledge the interaction and respond with an ephemeral message
      await interaction.reply({ content: 'Early access released!', ephemeral: true });

      const link = interaction.options.getString('link');
      const earlyAccessRoleId1 = '1296699750284005398'; // First role to be pinged
      const earlyAccessRoleId2 = '1297607289707958322';
      const earlyAccessRoleId3 = '1296699764678594654'; // Second role to be pinged

      const embed = new EmbedBuilder()
        .setTitle('Greenville Roleplay Native | Early Access Released!')
        .setDescription(`${interaction.user} has now released early access. To join, click on the button below called "Early Access Link". Once you have loaded in, park up and wait until the host has released the session to everyone. Make sure not to leak the link that the host provides to people that aren't on the server and that don't have access to early access.`)
        .setColor('#ff7d52')
        .setImage("https://cdn.discordapp.com/attachments/1284822686467493898/1297599992478830683/Session_Startup_16.png?ex=671683aa&is=6715322a&hm=70dc343a5dd2420886b37e201feb76ebfbd0179d9764a327d10a2115accb9995&")
        .setFooter({
            text: 'Greenville Roleplay Native',
            iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
        });

      const button = new ButtonBuilder()
        .setLabel('Early Access Link')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('early_access_link');

      const row = new ActionRowBuilder().addComponents(button);

      // Send the embed publicly with role pings
      const message = await interaction.channel.send({
        content: `<@&${earlyAccessRoleId1}> <@&${earlyAccessRoleId2}>, <@&${earlyAccessRoleId3}>`, // Pings the roles at the top of the message
        embeds: [embed],
        components: [row]
      });

      // Log the command execution as an embed
      const logChannelId = '1297599637867466783'; // Replace with your log channel ID
      const logChannel = interaction.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('Command Executed')
          .setDescription(`The \`/earlyaccess\` command was executed.`)
          .addFields(
            { name: 'Executed by', value: `${interaction.user.tag}`, inline: true },
            { name: 'User ID', value: `${interaction.user.id}`, inline: true },
            { name: 'Channel', value: `${interaction.channel.name}`, inline: true },
            { name: 'Link Provided', value: `${link}`, inline: false },
          )
          .setColor('#f1c40f')
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }

      const filter = i => i.customId === 'early_access_link' && i.isButton();

      interaction.client.on('message', async message => {
        // Check if the user has a role with the name "RRN I Staff Team"
        if (message.member.roles.find(r => r.name === 'RRN | Staff Team')){
            if (message.content === 'foo') {
                // do stuff...
            } else if (message.content === 'bar') {
               // do more stuff..
            }
        }
    });

      // Create a persistent interaction collector with no timeout
      const collector = message.createMessageComponentCollector({ filter });

      collector.on('collect', async i => {
        try {
          // Check if the user has the staff role or the early access roles
          if (!i.member.roles.cache.has(staffRoleId) &&
              !i.member.roles.cache.has(earlyAccessRoleId3) &&
              !i.member.roles.cache.has(earlyAccessRoleId1) &&
              !i.member.roles.cache.has(earlyAccessRoleId2)) {
            await i.reply({ content: 'You do not have permission to click on this button!', ephemeral: true });
          } else {
            // If the user has permission, send the link in an ephemeral message
            await i.reply({ content: `**Link** ${link}`, ephemeral: true });
          }
        } catch (error) {
          console.error('Error in button interaction:', error);
          await i.reply({ content: 'There was an error handling the button interaction.', ephemeral: true });
        }
      });

    } catch (error) {
      console.error('Error executing command:', error);
      if (!interaction.replied) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
};
