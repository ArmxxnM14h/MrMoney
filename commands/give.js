// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
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
  cooldowns: new Set(),
  cooldown: 10,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const given = interaction.options.getInteger("amount");
    schema.findOne({
      userID: interaction.user.id
    }, async (err, res) => {
      if (err) console.log(err);

      const bal = res.coins

      if (given <= 0) {
        const AnotherOne = new MessageEmbed()
          .setTitle("Haha you tried!")
          .setDescription(
            `Don't try abuse the system or we will be forced to blacklist you!`
          )
          .setColor("RANDOM");

        await interaction.reply({ embeds: [AnotherOne], ephemeral: true });

      } else if (user.id === interaction.user.id) {
        const embed = new MessageEmbed()
          .setTitle('Transfer Failed')
          .setDescription('You cannot give cash to yourself')
          .setColor('RANDOM')
        await interaction.reply({ embeds: [embed] })

      } else if (bal < given) {
        const ErrorEmbed = new MessageEmbed()
          .setTitle("Error In Transaction")
          .setDescription(
            "**Phone:** Your balance is too low to transfer your money to another user!"
          )
          .setColor("RANDOM");

        await interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
      } else if (bal >= given) {
        // Entirely new embed
        schema.findOne({
          userID: user.id
        }, async (err2, res2) => {
          if (err2) console.log(err);

          if (!res2) {
            const errEmbed = new MessageEmbed()
              .setColor("RED")
              .setDescription(`${user.username} hasn't used the bot yet!!`)
              .setTimestamp();

            // Reply to the entire interaction
            return interaction.reply({ embeds: [errEmbed] });
          } else {
            res2.coins = res2.coins + given
            res2.save().catch((err) => console.log(err));
            res.coins = res.coins - given
            res.save().catch(err => console.log(err));
            const deposit = res.coins
            const balEmbed = new MessageEmbed()
              .setColor("GREEN")
              .setTitle(`${interaction.user.username} has donated to ${user.tag}`)
              .setDescription(
                `**Phone:** $${given}  has been added to ${user.tag} wallet, Your wallet has been deducted to $${deposit}`
              )
              .setTimestamp();
            interaction.reply({ embeds: [balEmbed] });
          }
        });
      }
    })
  }
}
© 2022 GitHub, Inc
