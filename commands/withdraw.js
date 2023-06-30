// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, EmbedBuilder } = require("discord.js");
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
    cooldown: {
      duration: 7, // Set the cooldown duration in seconds
    },
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user")
    const subtract = interaction.options.getInteger("amount");
    const res = await schema.findOne({ userID: interaction.user.id })
 

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
          .setTitle('Unable to withdraw')
          .setDescription('You cannot withdraw anything under 0')
          .setColor('Random')
        return interaction.reply({ embeds: [Abuser], ephemeral: true })

      } else if (res.bank < subtract) {
        const ErrorEmbed = new EmbedBuilder()
          .setTitle('Error In Transaction')
          .setDescription('**Text:** Your balance is too low to transfer your money to the bank')
          .setColor('Random')
        return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true })
      }

      else if (res.bank >= subtract) {
        // Entirely new embed
        res.coins = res.coins + subtract
        res.bank = res.bank - subtract
        res.save();
        const balEmbed = new EmbedBuilder()
          .setColor("Green")
          .setTitle(`Bank Withdrawal`)
          .setDescription(` Cash has successfully been taken out:

Amount of cash taken out: **$${subtract}**

Wallet balance: **$${res.coins}**

Current bank balance: **$${res.bank}**
`)
          .setTimestamp();

        interaction.reply({ embeds: [balEmbed] });
      }
    }
  }
      