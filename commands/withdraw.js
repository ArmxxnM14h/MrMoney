// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("with")
    .setDescription("Withdraw cash out of your bank")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("choose the amount you want to withdraw")
        .setRequired(true),
    ),
cooldowns : new Set(),
cooldown : 6,
// Executing the interaction and defining nessessery stuff
  async execute(interaction) {
const user = interaction.options.getUser("user")
    const subtract = interaction.options.getInteger("amount");
const bank =  db.fetch(`${interaction.user.username}_bank`)
    if (bank < subtract) {
const ErrorEmbed = new MessageEmbed()
.setTitle('Error In Transaction')
.setDescription('**Phone:** You dont seem to have enough money in your bank to withdraw')
.setColor('RANDOM')
      return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true})
    }

 else if (bank > subtract) {
// Entirely new embed
      const deposit = db.subtract(`${interaction.user.username}_bank`, subtract) || 0;
      const bank = db.add(`${interaction.user.username}_wallet`, subtract) || 0;
      const balEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`${interaction.user.username}`)
        .setDescription(`**Phone:** $${subtract}  has been added to your wallet, You now have $${bank} in your wallet`)
        .setTimestamp();
        
      await interaction.reply({ embeds: [balEmbed] });
    }
  }
}