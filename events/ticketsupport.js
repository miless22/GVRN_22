const {
    Events,
    EmbedBuilder,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');

const ticketInfoMap = new Map();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check for button interactions
        if (interaction.isButton()) {
            if (interaction.customId === 'support') { // Check if the clicked button is "Support"
                // Create a modal for ticket type selection
                const modal = new ModalBuilder()
                    .setCustomId('ticket_type_modal')
                    .setTitle('Ticket Type Selection');

                // Create a text input for ticket type
                const ticketTypeInput = new TextInputBuilder()
                    .setCustomId('ticket_type_input')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setLabel('Enter Ticket Type:');

                // Add the input to a row
                const row = new ActionRowBuilder().addComponents(ticketTypeInput);
                modal.addComponents(row);

                // Show the modal to the user
                await interaction.showModal(modal);
                return; // Ensure to return to prevent further processing
            }
        }

        // Check for modal submissions
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'ticket_type_modal') {
                const ticketType = interaction.fields.getTextInputValue('ticket_type_input').toLowerCase();
                let channelName;
                let permissionOverwrites;

                // Determine channel name and permission overwrites based on ticket type
                if (ticketType === 'gs') {
                    channelName = `ticket-general-${interaction.user.username}`;
                    permissionOverwrites = [
                        {
                            id: '1296699710165225472', // Role ID for gs tickets
                            allow: ['ViewChannel'],
                        },
                        {
                            id: interaction.user.id, // Ticket opener
                            allow: ['ViewChannel'],
                        },
                        {
                            id: interaction.guild.id, // @everyone role
                            deny: ['ViewChannel'],
                        },
                    ];
                } else if (ticketType === 'mr') {
                    channelName = `ticket-member-report-${interaction.user.username}`;
                    permissionOverwrites = [
                        {
                            id: '1296699699641712691', // Role ID for mr tickets
                            allow: ['ViewChannel'],
                        },
                        {
                            id: interaction.user.id, // Ticket opener
                            allow: ['ViewChannel'],
                        },
                        {
                            id: interaction.guild.id, // @everyone role
                            deny: ['ViewChannel'],
                        },
                    ];
                } else {
                    await interaction.reply({ content: 'Invalid ticket type. Please try again.', ephemeral: true });
                    return;
                }

                // Create a new channel for the ticket
                const channel = await interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    permissionOverwrites: permissionOverwrites,
                });

                // Store the ticket opener's ID and channel in the map
                ticketInfoMap.set(channel.id, interaction.user.id);

                // Create buttons for closing and claiming the ticket
                const closeButton = new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger);

                const claimButton = new ButtonBuilder()
                    .setCustomId('claim_ticket')
                    .setLabel('Claim')
                    .setStyle(ButtonStyle.Primary);

                const buttonRow = new ActionRowBuilder().addComponents(closeButton, claimButton);

                // Create an embed that pings the user
                const embed = new EmbedBuilder()
                    .setColor('#ff7d52')
                    .setDescription(`Please state your question or issue and wait for our staff team to come and assist you. 
                    **Open Time**
                    <t:${Math.floor(Date.now() / 1000)}:R>`);

                // Send the embed message in the new channel with the buttons
                await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [buttonRow] });

                // Reply to the user
                await interaction.reply({ content: 'Your ticket channel has been created!', ephemeral: true });
                return; // Ensure to return to prevent further processing
            }
        }

        // Handling close ticket button interaction
        if (interaction.customId === 'close_ticket') {
            // Create an ephemeral confirmation embed with a final close button
            const confirmationEmbed = new EmbedBuilder()
                .setColor('#ff7d52')
                .setDescription('Are you sure you want to close this ticket? This action is not undoable.');

            // Create a confirm close button
            const confirmCloseButton = new ButtonBuilder()
                .setCustomId('confirm_close_ticket')
                .setLabel('Confirm Close')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(confirmCloseButton);

            // Send the ephemeral confirmation embed with the button
            await interaction.reply({ embeds: [confirmationEmbed], ephemeral: true, components: [row] });

            // Wait for the user to click the confirm close button
            const filter = (i) => i.customId === 'confirm_close_ticket' && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 }); // 15 seconds to respond

            collector.on('collect', async (i) => {
                // If they confirm closing the ticket
                const closingEmbed = new EmbedBuilder()
                    .setColor('#ff7d52')
                    .setDescription('Understood, closing ticket in 4 seconds.');

                await i.reply({ embeds: [closingEmbed], ephemeral: true });

                // Prepare the DM embed
                const userEmbed = new EmbedBuilder()
                    .setColor('#ff7d52')
                    .setTitle('Ticket Closed')
                    .setDescription(`Hello <@${i.user.id}> your ticket has been successfully closed. We hope our staff team was able to help you. If you feel like we didn't do well enough, you can open a ticket again.`);

                // Send a DM to the user
                await i.user.send({ embeds: [userEmbed] });

                // Wait 4 seconds before deleting the channel
                setTimeout(async () => {
                    // Delete the channel after sending the DM
                    await interaction.channel.delete();
                    console.log('Channel deleted after closing the ticket.');
                }, 4000);
            });

            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    await interaction.followUp({ content: 'You did not confirm the ticket closure in time.', ephemeral: true });
                }
            });
        }
    },
};
