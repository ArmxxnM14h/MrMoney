// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const schema = require("../models/userschema.js");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("give cash to people")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The person you want to give to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("choose the amount you want to give")
        .setRequired(true)
    ),
    cooldown: {
      duration: 40, // Set the cooldown duration in seconds
    },
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const given = interaction.options.getInteger("amount");
    const res = await schema.findOne({ userID: interaction.user.id });
  
    if (!res) {
      const errEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("An error has occurred")
        .setFooter("Contact Support.")
        .setColor("Red");
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  
    const bal = res.coins;
  
    if (given <= 0) {
      const AnotherOne = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("You cannot give anything less than one!")
        .setColor("Red");
      return interaction.reply({ embeds: [AnotherOne], ephemeral: true });
    } else if (user.id === interaction.user.id) {
      const embed = new EmbedBuilder()
        .setTitle("Transfer Failed")
        .setDescription("You cannot give cash to yourself")
        .setColor("Red");
      return interaction.reply({ embeds: [embed] });
    } else if (bal < given) {
      const ErrorEmbed = new EmbedBuilder()
        .setTitle("Error In Transaction")
        .setDescription("Your balance is below that amount")
        .setColor("Red");
      return interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
    } else if (bal >= given) {
      const res2 = await schema.findOne({ userID: user.id });
  
      if (!res2) {
        const errEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(`${user.username} hasn't used the bot yet!`)
          .setTimestamp();
        return interaction.reply({ embeds: [errEmbed] });
      } else {
        res2.coins += given;
        await res2.save();
        res.coins -= given;
        await res.save();
  
        const deposit = res.coins;
        const balEmbed = new EmbedBuilder()
          .setColor("Green")
          .setTitle(`Donation Time!`)
          .setDescription(
            `> ${user.username} has received $${given}\n\n> Given by ${interaction.user.username}`
          )
          .setFooter({
            text: `Current balance: $${deposit}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp();
  
        return interaction.reply({ embeds: [balEmbed] });
      }
    }
  }
}  