const schema = require("../models/userschema.js");
const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

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
    cooldown: {
      duration: 5, // Set the cooldown duration in seconds
    },

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (!user) {
    const res = await schema.findOne({ userID: interaction.user.id })


        if (!res) {
          const errEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('An error has occured')
          .setFooter('Contact Support.')
          .setColor('Red')
          return interaction.reply({embeds: [errEmbed], ephemeral: true})
        }

        const inventoryEmbed = new EmbedBuilder()
          .setTitle(`${interaction.user.username}'s Inventory`)
          .setColor('Random')
          .setTimestamp();

        if (res.inventory.length == 0) {
          inventoryEmbed.setDescription('No items in inventory')
          return await interaction.reply({ embeds: [inventoryEmbed] });
        }

        res.inventory.forEach(item => {
          inventoryEmbed.addFields({ name: `${item.name}`, value: `Quantity: ${item.count}x Type: ${item.itemType}`})
        });
        return await interaction.reply({ embeds: [inventoryEmbed] })

    } else if (user) {
      schema.findOne({
        userID: user.id
      }, async (err, res) => {
        if (err) console.log(err);

        if (!res) {
          const errEmbed = new EmbedBuilder()
            .setTitle('Error...')
            .setDescription(`${user.username} hasn't used the bot yet!!`)
            .setColor('Red')
          return await interaction.reply({ embeds: [errEmbed] });
        }

        const inventoryEmbed = new EmbedBuilder()
          .setTitle(`${user.username}'s Inventory`)
          .setColor('Random')
          .setTimestamp();

        if (res.inventory.length == 0) {
          inventoryEmbed.setDescription('No items in inventory')
          return await interaction.reply({ embeds: [inventoryEmbed] });
        }

        res.inventory.forEach(item => {
          inventoryEmbed.addFields({ name: `${item.name}`, value: `Quantity: ${item.count}x Type: ${item.itemType}` })
        });
        return await interaction.reply({ embeds: [inventoryEmbed] });
      });
    }
  }
}