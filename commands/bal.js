const schema = require("../models/userschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Get your balance or another user's balance!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Get another user's balance!")
        .setRequired(false),

    ),
  cooldowns: new Set(),
  cooldown: 5,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");


    if (user) {
      schema.findOne({
        userID: user.id
      }, async (err, res) => {
        if (err) console.log(err);

        if (!res) {
          const newDoc = new schema({
            userID: interaction.user.id,
            userName: interaction.user.username,
            serverID: interaction.guild.id,
            coins: 100
          });
          newDoc.save().catch(err => console.log(err));

          const balEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`${user.tag}'s Balance'`)

            .setDescription(`$${res.coins}`)
            .setTimestamp();

          // Reply to the entire interaction
          await interaction.reply({ embeds: [balEmbed] });
        } else {

          const balEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`${user.tag}'s Balance'`)
            .setDescription(`:purse: Wallet: $${res.coins}`)
            .setTimestamp();

          // Reply to the entire interaction
          await interaction.reply({ embeds: [balEmbed] });
        }
      });
    } else {
      schema.findOne({
        userID: interaction.user.id
      }, async (err, res) => {
        if (err) console.log(err);

        if (!res) {
          const newDoc = new schema({
            userID: interaction.user.id,
            userName: interaction.user.username,
            serverID: interaction.guild.id,
            coins: 100
          });
          newDoc.save().catch(err => console.log(err));

          const balEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`${interaction.user.tag}'s Balance'`)
            .setDescription(`$${res.coins}`)
            .setTimestamp();

          // Reply to the entire interaction
          await interaction.reply({ embeds: [balEmbed] });
        } else {

          const balEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`${interaction.user.tag}'s Balance'`)
            .setDescription(`:purse: Wallet: $${res.coins}`)
            .setTimestamp();

          // Reply to the entire interaction
          await interaction.reply({ embeds: [balEmbed] });
        }
      });
    }
  }
}
