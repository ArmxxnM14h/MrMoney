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
bankEmoji = ":no_entry:"
  } else {
bankEmoji = ":white_check_mark:"
  } if (res.workxp < 1000) {
accountantEmoji = ":no_entry:"
  } else {
  accountantEmoji = ":white_check_mark:"
  } if (res.workxp < 200){
   taxiEmoji = ":no_entry:"
  } else {
    taxiEmoji = ":white_check_mark:"
    } if (res.workxp < 150){
    policeEmoji = ":no_entry:"
    } else {
    policeEmoji = ":white_check_mark:"
    } 

const viewJob = new MessageEmbed()
.setColor('RANDOM')
.setTitle("Jobs")
.setDescription(`
If a job is unavailable the emoji will be :no_entry:

1) **Banker** - 20XP per Hour, 300 Coins per Hour - ${bankEmoji}

2) **Accountant** - 40XP per Hour, 600 Coins per Hour - ${accountantEmoji}

3) **Streamer** - 5XP per Hour, 100 Coins per Hour - :white_check_mark:

4) **Taxi Driver** - 20XP per Hour, 200 Coins per Hour - ${taxiEmoji}

5) **Police** - 15XP per Hour, 200 Coins per Hour - ${policeEmoji}

6) Cashier - 5XP per Hour, 100 Coins per Hour - :white_check_mark:`) 
.setTimestamp()
interaction.reply({ embeds: [viewJob] });
    }

);
    }
}
