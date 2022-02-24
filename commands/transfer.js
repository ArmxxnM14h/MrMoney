// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("transfer cash from bank to other peoples banks")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The person you want to transfer to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("choose the amount you want to give")
        .setRequired(true)
    ),
cooldowns : new Set(),
cooldown : 10,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const given = interaction.options.getInteger("amount");
    const bal = db.fetch(`${interaction.user.username}_bank`);

    if (given <= 0) {
      const AnotherOne = new MessageEmbed()
        .setTitle("Haha you tried!")
        .setDescription(
          `Don't try abuse the system or we will be forced to blacklist you!`
        )
        .setColor("RANDOM");

      await interaction.reply({ embeds: [AnotherOne], ephemeral: true });
    } else if (bal < given) {
      const ErrorEmbed = new MessageEmbed()
        .setTitle("Error In Transaction")
        .setDescription(
          "**Phone:** Your balance is too low to transfer your money to another user!"
        )
        .setColor("RANDOM");

      await interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
    } else if (bal > given) {
      // Entirely new embed
      const deposit =
        db.subtract(`${interaction.user.username}_bank`, given) || 0;
      const bank = db.add(`${user.username}_bank`, given) || 0;
      const balEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`You donated to ${user.username}!`)
        .setDescription(
          `**Bank Statements:**

**Given to:** ${user.username}

**Amount given:** ${given}

**Money in wallet now:** ${bal}`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [balEmbed] });
    }
  },
};