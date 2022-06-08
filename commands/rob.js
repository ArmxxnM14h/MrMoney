// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const schema = require("../models/userschema.js");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("rob from the people of Mr Money")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The person you want to rob from")
        .setRequired(true)
    ),
  cooldowns: new Set(),
  cooldown: 5,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (interaction.user.id === user.id) return interaction.reply("You cannot rob yourself!");

    schema.findOne({
      userID: interaction.user.id
    }, async (err, res) => {
      if (err) console.log(err);

      schema.findOne({
        userID: user.id
      }, async (err2, res2) => {
        if (err2) console.log(err2);

        if (!res2) {
          const errEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${user.username} hasn't used the bot yet!!`)
            .setTimestamp();

          // Reply to the entire interaction
          return interaction.reply({ embeds: [errEmbed] });
        }

        if (res2.coins < 50) {
          const AnotherOne = new MessageEmbed()
            .setTitle("Bruh..")
            .setDescription(
              `Why are you robbing users with a balance of less then 50??`
            )
            .setColor("RANDOM");

          return await interaction.reply({ embeds: [AnotherOne], ephemeral: true });
        } else if (res.coins < 500) {
          const BrokeBoi = new MessageEmbed()
            .setTitle('Your broke')
            .setDescription(`You need minimum $500 in your wallet to rob dude`)
            .setColor('RANDOM')
          return await interaction.reply({ embeds: [BrokeBoi] });
        }

        const chance = Math.floor(Math.random() * Math.floor(100));

        if (chance < 50) {
          const ErrorEmbed = new MessageEmbed()
            .setTitle("Yikes...")
            .setDescription(
              "You really failed the robbery and lost a total of $500")
            .setColor("RANDOM");
          res.coins = res.coins - 500;
          res.save().catch(err => console.log(err));
          return await interaction.reply({ embeds: [ErrorEmbed] });
        } else if (chance >= 50) {
          const Ampro = Math.floor(Math.random() * Math.floor(res2.coins));
          const RobberySuccess = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Success!`)
            .setDescription(
              `You robbed a ${user.username} of $${Ampro}, you are so bad..`
            )
            .setTimestamp();
          res.coins = res.coins + Ampro;
          res.save().catch(err => console.log(err));
          res2.coins = res2.coins - Ampro;
          res2.save().catch(err => console.log(err));
          return await interaction.reply({ embeds: [RobberySuccess] });
        }
      });
    });
  },
};
