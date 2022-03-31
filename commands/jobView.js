const schema = require("../models/userschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("viewjob")
    .setDescription("view jobs"),
    cooldowns: new Set(),
    cooldown: 5,
    execute(interaction) {
schema.findOne({
    userID: interaction.user.id
}, (err, res) => {
    if (!res) {
        interaction.reply({content: "first time users need to use the bal command to start", ephemeral: true})
    }
    if (err) console.log(err);
  if(res.workxp < 300) {
bankEmoji = "<:red:903369899093680169>"
  } else {
bankEmoji = "<:green:903369570100850688>"
  } if (res.workxp < 1000) {
accountantEmoji = "<:red:903369899093680169>"
  } else {
  accountantEmoji = "<:green:903369570100850688>"
  } if (res.workxp < 200){
   taxiEmoji = "<:red:903369899093680169>"
  } else {
    taxiEmoji = "<:green:903369570100850688>"
    } if (res.workxp < 150){
    policeEmoji = "<:red:903369899093680169>"
    } else {
    policeEmoji = "<:green:903369570100850688>"
    } 

const viewJob = new MessageEmbed()
.setColor('RANDOM')
.setTitle("Jobs")
.setDescription(`
If a job is unavailable the emoji will be :no_entry:

1) **Banker** - 20XP per Hour, 300 Coins per Hour - ${bankEmoji}

2) **Accountant** - 40XP per Hour, 600 Coins per Hour - ${accountantEmoji}

3) <:money_streamer:958783889478938644> **Streamer** - 5XP per Hour, 100 Coins per Hour - <:green:903369570100850688>

4) **Taxi Driver** - 20XP per Hour, 200 Coins per Hour - ${taxiEmoji}

5) **Police** - 15XP per Hour, 200 Coins per Hour - ${policeEmoji}

6) **Cashier** - 5XP per Hour, 100 Coins per Hour - <:green:903369570100850688>`) 
.setTimestamp()
interaction.reply({ embeds: [viewJob] });
    }

);
    }
}
