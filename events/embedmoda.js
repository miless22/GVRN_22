const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Check if the interaction is a modal submission
        if (!interaction.isModalSubmit()) return;

        // Check if the modal ID matches
        if (interaction.customId === 'embed_modal') {
            const title = interaction.fields.getTextInputValue('embed_title');
            const description = interaction.fields.getTextInputValue('embed_description');
            const image = interaction.fields.getTextInputValue('embed_image');
            const thumbnail = interaction.fields.getTextInputValue('embed_thumbnail');

            // Create the embed using EmbedBuilder
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor('#ff7d52');

            // Set the image if provided
            if (image) {
                embed.setImage(image);
            }

            // Set the thumbnail if provided
            if (thumbnail) {
                embed.setThumbnail(thumbnail);
            }

            // Send the embed to the channel where the command was triggered
            const message = await interaction.channel.send({
        embeds: [embed],
      });
        }
    },
};
