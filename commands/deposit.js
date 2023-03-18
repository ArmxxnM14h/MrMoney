// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const schema = require("../models/userschema.js");
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
    schema.findOne({
      userID: interaction.user.id
    }, (err, res) => {
      if (err) console.log(err);

      if (!res) {
        const errEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('An error has occured')
        .setFooter('Contact Support.')
        .setColor('Red')
        return interaction.reply({embeds: [errEmbed], ephemeral: true})
      }

      if (subtract <= 0) {
        const Abuser = new EmbedBuilder()
          .setTitle('Lmao you tried abusing the system')
          .setDescription('Why you tryna abuse the system dude... What have i done to you')
          .setColor('Random')
        return interaction.reply({ embeds: [Abuser], ephemeral: true })

      } else if (res.coins < subtract) {
        const ErrorEmbed = new EmbedBuilder()
          .setTitle('Error In Transaction')
          .setDescription('**Text:** Your balance is too low to transfer your money to the bank')
          .setColor('Random')
        return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true })
      }

      else if (res.coins >= subtract) {
        // Entirely new embed
        res.coins = res.coins - subtract
        res.bank = res.bank + subtract
        res.save();
        const balEmbed = new EmbedBuilder()
          .setColor("Green")
          .setTitle(`${interaction.user.username}`)
          .setDescription(`**Phone:** $${subtract}  has been added to your bank account, Your bank account now has $${res.bank}`)
          .setTimestamp();

        interaction.reply({ embeds: [balEmbed] });
      }
    });
  }
}          
