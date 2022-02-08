// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const schema = require("../models/userschema.js");
// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("with")
    .setDescription("withdraw cash from your bank")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("choose the amount you want to deposit")
        .setRequired(true)
    ),
cooldowns : new Set(),
cooldown : 5, 
// Executing the interaction and defining nessessery stuff
  async execute(interaction) {
const user = interaction.options.getUser("user")
    const subtract = interaction.options.getInteger("amount");
schema.findOne({
			userID: interaction.user.id
		}, (err, res) => {
			if (err) console.log(err);

if(!res){
const errEmbed = new MessageEmbed()
.setTitle('Error...')
.setDescription('First time users must execute the bal command before using other commands')
.setColor('RANDOM')
}

    if (subtract <= 0) {
      const Abuser = new MessageEmbed()
        .setTitle('Unable to withdraw')
        .setDescription('You cannot withdraw anything under 0')
        .setColor('RANDOM')
      return interaction.reply({ embeds: [Abuser], ephemeral: true })

    } else if (res.bank < subtract) {
const ErrorEmbed = new MessageEmbed()
.setTitle('Error In Transaction')
.setDescription('**Text:** Your balance is too low to transfer your money to the bank')
.setColor('RANDOM')
      return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true})
    }

 else if (res.bank > subtract) {
// Entirely new embed
      res.coins = res.coins + subtract
      res.bank = res.bank - subtract
res.save();
      const balEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`Bank Withdrawal`)
        .setDescription(` Cash has successfully been taken out:

Amount of cash taken out: **$${subtract}**

Wallet balance: **$${res.coins}**

Current bank balance: **$${res.bank}**
`)
        .setTimestamp();
        
       interaction.reply({ embeds: [balEmbed] });
    }
  });
  }
}          
