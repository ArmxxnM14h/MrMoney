const schema = require("../models/userschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View your inventory or another user's inventory!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("View another user's inventory!")
        .setRequired(false),
    ),
  cooldowns: new Set(),
  cooldown: 5,

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (!user) {
      schema.findOne({
        userID: interaction.user.id
      }, async (err, res) => {
        if (err) console.log(err);

        if (!res) {
          const errEmbed = new MessageEmbed()
            .setTitle('Error...')
            .setDescription('First time users must execute the bal command before using other commands')
            .setColor('RANDOM')
          return await interaction.reply({ embeds: [errEmbed] });
        }

        const inventoryEmbed = new MessageEmbed()
          .setTitle(`${interaction.user.username}'s Inventory`)
          .setColor('RANDOM')
          .setTimestamp();

        if (res.inventory.length == 0) {
          inventoryEmbed.setDescription('No items in inventory')
          return await interaction.reply({ embeds: [inventoryEmbed] });
        }

        res.inventory.forEach(item => {
          inventoryEmbed.addField(`${item.name}`, `Quantity: ${item.count}x Type: ${item.itemType}`)
        });
        return await interaction.reply({ embeds: [inventoryEmbed] });
      })
    } else if (user) {
      schema.findOne({
        userID: user.id
      }, async (err, res) => {
        if (err) console.log(err);

        if (!res) {
          const errEmbed = new MessageEmbed()
            .setTitle('Error...')
            .setDescription(`${user.username} hasn't used the bot yet!!`)
            .setColor('RANDOM')
          return await interaction.reply({ embeds: [errEmbed] });
        }

        const inventoryEmbed = new MessageEmbed()
          .setTitle(`${user.username}'s Inventory`)
          .setColor('RANDOM')
          .setTimestamp();

        if (res.inventory.length == 0) {
          inventoryEmbed.setDescription('No items in inventory')
          return await interaction.reply({ embeds: [inventoryEmbed] });
        }

        res.inventory.forEach(item => {
          inventoryEmbed.addField(`${item.name}`, `Quantity: ${item.count}x Type: ${item.itemType}`)
        });
        return await interaction.reply({ embeds: [inventoryEmbed] });
      });
    }
  }
}