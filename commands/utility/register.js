const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); // Import EmbedBuilder
const fs = require('fs');
const path = require('path');

const dataDirPath = path.join(__dirname, '../../data/vehicleData');
const logChannelId = '1297599637867466783'; // Replace with your channel ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register your vehicle.')
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('Vehicle Year')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('make')
                .setDescription('Vehicle Make')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Vehicle Model')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Vehicle Color')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('number-plate')
                .setDescription('Vehicle Number Plate')
                .setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const year = interaction.options.getInteger('year');
            const make = interaction.options.getString('make');
            const model = interaction.options.getString('model');
            const color = interaction.options.getString('color');
            const numberPlate = interaction.options.getString('number-plate');
            const userId = interaction.user.id;

            if (!fs.existsSync(dataDirPath)) {
                fs.mkdirSync(dataDirPath, { recursive: true });
            }

            const userFilePath = path.join(dataDirPath, `${userId}.json`);

            let vehicleData = [];
            if (fs.existsSync(userFilePath)) {
                vehicleData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            vehicleData.push({ year, make, model, color, numberPlate });

            fs.writeFileSync(userFilePath, JSON.stringify(vehicleData, null, 2), 'utf8');

            // Create an ephemeral embed for the response
            const embed = new EmbedBuilder()
                .setColor('#ff7d52') // Set your desired embed color
                .setDescription('Your vehicle has been successfully registered.');

            // Send the ephemeral embed
            await interaction.editReply({
                embeds: [embed], // Send the embed as a reply
                ephemeral: true
            });

            // Send the registration info to the specified channel
            const logChannel = await interaction.guild.channels.fetch(logChannelId);
            if (logChannel) {
                const registrationMessage = `New Vehicle Registration:\n**User:** <@${userId}>\n**Year:** ${year}\n**Make:** ${make}\n**Model:** ${model}\n**Color:** ${color}\n**Number Plate:** ${numberPlate}`;
                await logChannel.send(registrationMessage);
            } else {
                console.error('Log channel not found');
            }

        } catch (error) {
            console.error('Error processing vehicle registration:', error);
            if (!interaction.replied) {
                await interaction.editReply({
                    content: 'An error occurred while processing your request. Please try again later.',
                    ephemeral: true // Make this reply ephemeral
                });
            }
        }
    },
};
