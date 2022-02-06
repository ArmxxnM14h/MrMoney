// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("dep")
    .setDescription("deposit cash in your bank")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("choose the amount you want to deposit")
        .setRequired(true)
    ),
  cooldowns: new Set(),
  cooldown: 5,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user")
    const subtract = interaction.options.getInteger("amount");
    const bal = db.fetch(`${interaction.user.username}_wallet`)
    if (bal < subtract) {
      const ErrorEmbed = new MessageEmbed()
        .setTitle('Error In Transaction')
        .setDescription('**Phone:** Your balance is too low to transfer your money to the bank')
        .setColor('RANDOM')
      return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true })
    }

    else if (bal > subtract) {
      // Entirely new embed
      const deposit = db.subtract(`${interaction.user.username}_wallet`, subtract) || 0;
      const bank = db.add(`${interaction.user.username}_bank`, subtract) || 0;
      const balEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`${interaction.user.username}`)
        .setDescription(`**Phone:** $${subtract}  has been added to your bank account, Your bank account now has $${bank}`)
        .setTimestamp();

      await interaction.reply({ embeds: [balEmbed] });
    }
  }
}