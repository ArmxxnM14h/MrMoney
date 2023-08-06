const Discord = require('discord.js')
const fs = require('fs');
const express = require('express');
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

const app = express();
const port = 3000; 
const TOP_GG_WEBHOOK_SECRET = 'MrMoneyVotersEMBED';
const CHANNEL_ID = '958064698048266271';
app.use(express.json());

app.post('/topggwebhook', (req, res) => {
    const voteData = req.body;
    
    if (req.header('Authorization') !== TOP_GG_WEBHOOK_SECRET) {
      return res.sendStatus(401);
    }
  
    // Process the vote data and create an embed message
    const embed = new Discord.EmbedBuilder()
      .setTitle('New Vote on top.gg')
      .setDescription(`User ${voteData.user} has voted!`)
      .setColor('#00FF00');
  
    // Get the desired channel by ID and send the embed message
    const channel = client.channels.cache.get(CHANNEL_ID);
      channel.send(embed);
  
    res.sendStatus(200);
  });
  
  // Start the web server
  app.listen(port, () => {
    console.log(`Web server listening on port ${port}`);
  });
  


client.login(token);
require('./utils/updateStock.js');
