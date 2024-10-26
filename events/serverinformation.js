const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle select menu interaction
        if (interaction.isStringSelectMenu()) {
            const { customId, values } = interaction;

            // Acknowledge the interaction
            await interaction.deferUpdate();

            if (customId === 'server_information') {
                const selectedValue = values[0];
                let embed;
                let secondEmbed; // Declare a variable for the second embed
                let components = [];

                // Create the embed based on the selected value
                switch (selectedValue) {
                    case 'sl':
                        embed = new EmbedBuilder()
                        .setColor('#ff7d52')
                            .setTitle('Server Links')
                            .setDescription(`Welcome to the server links section, this is where you can get the links that are affiliated with the server.`)
                            .addFields([
                                { name: 'Pikeville', value: 'discord.gg/pikeville', inline: true },
                                { name: 'Banned Vehicle List', value: 'https://bit.ly/3NGvCcc', inline: true },
                                { name: 'Youtube Channel', value: 'https://www.youtube.com/@Gvnative', inline: true },
                            ])
                            .setFooter({
                                text: 'Greenville Roleplay Native',
                                iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                            });
        
                        break;
                    case 'sp':
                        embed = new EmbedBuilder()
                            .setDescription(`Click on the button below to receive the session ping role.`)
                            .setColor('#ff7d52')
                            .setFooter({
                                text: 'Greenville Roleplay Native',
                                iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                            });
        
                        // Create a button for the session ping
                        const button = new ButtonBuilder()
                            .setCustomId('session_ping') // Set the custom ID for the button
                            .setLabel('Session Ping') // Button text
                            .setStyle(ButtonStyle.Primary); // Button style

                        components.push(new ActionRowBuilder().addComponents(button)); // Add button to the action row
                        break;
                    case 'rf':
                        embed = new EmbedBuilder()
                            .setTitle("Roleplay Information")
                            .setDescription(`Below are the essential guidelines that every member must read and understand when participating in roleplay activities. These rules are designed to ensure a fun and respectful environment for everyone involved:`)
                            .setColor('#ff7d52')
                            .setFooter({
                                text: 'Greenville Roleplay Native',
                                iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
                            });
        
                        
                        // Create a second embed for additional information
                        secondEmbed = new EmbedBuilder()
                            .setDescription(`
**FRP Speed**  
> FRP Speed is required to be followed in all roleplay sessions. Failing to follow it will result in a suspension.  
> Avoid going over the FRP speed limit; if caught exceeding it, the host can remove you from the roleplay session.

**Void**  
> The term "void" is to be used only by staff members to ignore the current scene.  
> Failing to follow orders when a staff member uses this will result in removal from the session.

**Combat Logging**  
> You may not leave the session in the middle of a scene; if you do, you will be punished.

**Character**  
> The character you will be roleplaying must be realistic. Characters like animals, small cars, etc., are generally not allowed.

**Vehicle Modifications**  
> The vehicle you will be driving must be realistic, and upgrades can only be stage 2. Failing to follow this will require you to change your vehicle.

**Traffic Lights**  
> **Green Light**: Proceed if the road is clear, without any other vehicles or pedestrians.  
> **Yellow Light**: Slow down and wait at the stop as the light turns red.  
> **Red Light**: Wait for the traffic light to turn green.

**Peace Time Information**  
**__Peace Time On__**:  
> FRP Speed: 85 MPH  
> No criminal actions  
> No evading LEO  
> No running red lights  

**__Strict Peacetime__**:  
> FRP Speed: 60 MPH  
> No criminal actions  
> No evading LEO  
> No running red lights  

**__No Peace Time__**:  
> Over 95  
> Drift  
> Criminal actions  
> Evading LEO  
> Rob stores  
> Run red lights  

**Banned Roleplays**  
> Drug and alcohol  
> Gang  
> Gore  
> Public shooting  
> Sex roleplays  
> Suicide roleplay  `)
.setColor('#ff7d52')
.setFooter({
    text: 'Greenville Roleplay Native',
    iconURL: 'https://cdn.discordapp.com/icons/1284787684644093992/1822cd06a9b79d9b2881b8193f4a81b3.png?size=4096'
});

                        break;
                    default:
                        embed = new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('Error')
                            .setDescription('Invalid selection. Please try again.');
                }

                // Prepare embeds array
                const embeds = [embed];
                if (secondEmbed) embeds.push(secondEmbed); // Only add secondEmbed if it's defined

                // Reply to the interaction with the selected embeds and the button
                await interaction.followUp({ embeds: embeds, components: components, ephemeral: true });
            }
        }

        // Handle button interaction for Session Ping
        if (interaction.isButton()) {
            if (interaction.customId === 'session_ping') {
                const roleId = '1296699767472259072';
                const member = interaction.member;

                // Check if the member already has the role
                const hasRole = member.roles.cache.has(roleId);

                if (hasRole) {
                    // Remove the role
                    await member.roles.remove(roleId);
                    await interaction.reply({ content: '<@&1296699767472259072> role removed.', ephemeral: true });
                } else {
                    // Add the role
                    await member.roles.add(roleId);
                    await interaction.reply({ content: `<@&1296699767472259072> role added.`, ephemeral: true });
                }
            }
        }
    },
};
