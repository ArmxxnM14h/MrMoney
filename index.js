const Discord = require('discord.js')
const fs = require('fs');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { token, guildId } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

client.commands = new Collection();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}



client.login(token);
require('./utils/updateStock.js');