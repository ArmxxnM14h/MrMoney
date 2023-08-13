const Discord = require('discord.js')
const fs = require('fs');
const express = require('express');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { token, guildId } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel, Partials.Message] });

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

const Topgg = require("@top-gg/sdk");
const app = express();
const webhook = new Topgg.Webhook("MrMoneyVotersEMBED");
const CHANNEL_ID = '958064698048266271';
app.post(
  "/topggwebhook",
  webhook.listener((vote) => {

    const embed = new Discord.EmbedBuilder()
      .setTitle('New Vote on top.gg')
      .setDescription(`User ${vote.user} has voted!`)
      .setColor('#00FF00');
  
    // Get the desired channel by ID and send the embed message
    const channel = client.channels.cache.get(CHANNEL_ID);
      channel.send(embed);
    
    console.log(vote.user); 
  })
); 
app.listen(3000); 
client.login(token);
require('./utils/updateStock.js');