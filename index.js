const Discord = require('discord.js')
const fs = require('fs');
const { Client, Intents } = require('discord.js');
const { token, guildId } = require('./config.json');
const prettyMilliseconds  = require("pretty-ms");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });



const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}



client.login(token);
require('./utils/updateStock.js');
