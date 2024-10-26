const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const dataFolderPath = path.join(__dirname, '../../data/vehicleData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for a vehicle by its number plate.')
        .addStringOption(option => 
            option.setName('plate')
                .setDescription('The number plate of the vehicle to search for')
                .setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const plate = interaction.options.getString('plate').toUpperCase();

            let found = false;
            let foundVehicle = null;
            let vehicleOwnerId = null;

            // Search for the vehicle in all user files
            const userFiles = fs.readdirSync(dataFolderPath);
            for (const file of userFiles) {
                const filePath = path.join(dataFolderPath, file);
                const userVehicles = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                const vehicle = userVehicles.find(v => v.numberPlate.toUpperCase() === plate);
                if (vehicle) {
                    found = true;
                    foundVehicle = vehicle;
                    vehicleOwnerId = path.basename(file, '.json'); // Extract user ID from the filename
                    break;
                }
            }

            if (found) {
                const user = await interaction.client.users.fetch(vehicleOwnerId);
                const searchEmbed = new EmbedBuilder()
                    .setTitle('Vehicle Found')
                    .setColor('#ff7d52')
                    .setDescription(`**Number Plate**: ${foundVehicle.numberPlate}\n**Year**: ${foundVehicle.year}\n**Make**: ${foundVehicle.make}\n**Model**: ${foundVehicle.model}\n**Color**: ${foundVehicle.color}\n**Owner**: <@${vehicleOwnerId}>`)
                    .setFooter({
                        text: 'Greenville Roleplay Native',
                        iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                    })

                    .setThumbnail(user.displayAvatarURL()); // Add owner’s avatar if needed

                await interaction.editReply({ embeds: [searchEmbed] });
            } else {
                await interaction.editReply({ content: 'No vehicle found with that number plate.' });
            }

        } catch (error) {
            console.error('Error searching for vehicle:', error);
            await interaction.editReply({ content: 'An error occurred while searching for the vehicle. Please try again later.' });
        }
    },
};
