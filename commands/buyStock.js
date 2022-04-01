const userschema = require("../models/userschema.js");
const stockschema = require("../models/stockschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buystock")
    .setDescription("Buy stocks or cryptos from the market!")
    .addStringOption((option) => 
      option
        .setName("stockname")
        .setDescription("The stock or crypto you want to buy.")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("The no. of stocks you want to buy.")
        .setRequired(true),
    ),
  cooldowns: new Set(),
  cooldown: 5,

  async execute(interaction) {
    const stockname = interaction.options.getString("stockname");
    const quantity = interaction.options.getInteger("quantity");

    if (quantity < 1) {
      return await interaction.reply("Mf what are you doing!! You can't buy less than 1 stock.");
    }

    stockschema.findOne({
      stockName: stockname
    }, async (err, res) => {
      if(err) console.log(err);

      if(!res) {
        const errEmbed = new MessageEmbed()
        .setTitle('Error...')
        .setDescription('That stock or crypto does not exist!')
        .setColor('RED');
        return await interaction.reply({ embeds: [errEmbed] });
      }

      userschema.findOne({
        userID: interaction.user.id
      }, async (usererr, userres) => {
        if(usererr) console.log(usererr);

        if(!userres) {
          const errEmbed = new MessageEmbed()
          .setTitle('Error...')
          .setDescription('First time users must execute the bal command before using other commands')
          .setColor('RED');
          return await interaction.reply({ embeds: [errEmbed] });
        }

        const totalPrice = res.currentPrice * quantity;

        if(userres.coins < totalPrice) {
          const errEmbed = new MessageEmbed()
          .setTitle('Error...')
          .setDescription('You do not have enough coins to buy this stock!')
          .setColor('RED');
          return await interaction.reply({ embeds: [errEmbed] });
        }

        userres.coins -= totalPrice;
        userres.inventory.push({
          name: stockname,
          count: quantity
        });
        userres.save().catch(err => console.log(err));
      });
    });
  }
}