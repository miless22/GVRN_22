const { SlashCommandBuilder } = require('discord.js');
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embedset')
        .setDescription('Open a modal to create an embed')
        .setDefaultMemberPermissions(0), // Only allow admins to use this command

    async execute(interaction) {
        console.log('Received /embedset command');

        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('embed_modal')
            .setTitle('Create an Embed');

        // Create the title input
        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel('Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        // Create the description input
        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        // Create the image link input
        const imageInput = new TextInputBuilder()
            .setCustomId('embed_image')
            .setLabel('Image Link (optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // Create the thumbnail input
        const thumbnailInput = new TextInputBuilder()
            .setCustomId('embed_thumbnail')
            .setLabel('Thumbnail (optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // Add inputs to action rows
        const actionRow1 = { type: 1, components: [titleInput] };
        const actionRow2 = { type: 1, components: [descriptionInput] };
        const actionRow3 = { type: 1, components: [imageInput] };
        const actionRow4 = { type: 1, components: [thumbnailInput] };

        // Add all action rows to the modal
        modal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4);

        try {
            // Show the modal to the user
            await interaction.showModal(modal);
            console.log('Modal displayed successfully');
        } catch (error) {
            console.error('Error showing modal:', error);
        }
    },
};
