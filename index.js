require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const { token } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // Add this intent to listen for member updates
  ],
});
client.commands = new Collection();
client.commandArray = [];

// Ready event to log bot information
client.once('ready', () => {
  console.log(`${client.user?.username} - (${client.user?.id})`); // Log bot username and ID when ready
});

// Event to handle member join
client.on('guildMemberAdd', async (member) => {
  const channelId = '1296699873411989529'; // Channel ID where the message will be sent
  const channel = member.guild.channels.cache.get(channelId);
  
  // Role ID to be assigned
  const roleId = '1296699741668904983'; 

  // Assign the role if the member doesn't already have it
  const role = member.guild.roles.cache.get(roleId);
  if (role && !member.roles.cache.has(roleId)) {
    await member.roles.add(role)
      .then(() => console.log(`Role ${role.name} assigned to ${member.user.tag}`))
      .catch(console.error); // Handle potential errors
  }

  if (channel) {
    await channel.send(`👋 ${member.user.tag} joined.`); // Send message when a user joins
  }
});

// Event to handle member leave
client.on('guildMemberRemove', async (member) => {
  const channelId = '1296699873411989529'; // Channel ID where the message will be sent
  const channel = member.guild.channels.cache.get(channelId);
  if (channel) {
    await channel.send(`👋 ${member.user.tag} left.`); // Send message when a user leaves
  }
});

const handleEvents = async () => {
  const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
  }
};

const handleCommands = async () => {
  const commandFolders = fs.readdirSync('./commands');
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      client.commands.set(command.data.name, command);
      client.commandArray.push(command.data.toJSON());
    }
  }

  const clientId = "1297564546550075412"; 
  const guildId = "1284787684644093992"; 
  const rest = new REST({ version: '9' }).setToken(token);

  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: client.commandArray,
    });
    console.log("Slash commands uploaded");
  } catch (error) {
    console.error(error);
  }
};

client.handleEvents = handleEvents;
client.handleCommands = handleCommands;

(async () => {
  await client.handleEvents();
  await client.handleCommands();
})();

client.login(token);
