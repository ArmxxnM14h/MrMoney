const userschema = require("../models/userschema.js");
const stockschema = require("../models/stockschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stock_buy")
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
      if (err) console.log(err);

      if (!res) {
        const errEmbed = new EmbedBuilder()
          .setTitle('Error...')
          .setDescription('That stock or crypto does not exist!')
          .setColor('Red');
        return await interaction.reply({ embeds: [errEmbed] });
      }

      userschema.findOne({
        userID: interaction.user.id
      }, async (usererr, userres) => {
        if (usererr) console.log(usererr);

        if (!userres) {
          const errEmbed = new EmbedBuilder()
            .setTitle('Error...')
            .setDescription('First time users must execute the bal command before using other commands')
            .setColor('Red');
          return await interaction.reply({ embeds: [errEmbed] });
        }

        const totalPrice = res.currentPrice * quantity;

        if (userres.coins < totalPrice) {
          const errEmbed = new EmbedBuilder()
            .setTitle('Error...')
            .setDescription('You do not have enough coins to buy this stock!')
            .setColor('Red');
          return await interaction.reply({ embeds: [errEmbed] });
        }

        userres.coins = userres.coins - totalPrice;  

        if (userres.inventory.some(item => item.name == stockname)) {
          userres.inventory.forEach(item => {
            if (item.name == stockname) {
              item.count = item.count + quantity;
            }
          });
          userres.save().catch(err => console.log(err));
        } else {
          userres.inventory.push({
            name: stockname,
            count: quantity,
            itemType: "Stock"
          });
          userres.save().catch(err => console.log(err));
        }

        res.volume = res.volume + quantity;
        if(totalPrice >= res.volume) {
          const newPrice = totalPrice - res.volume;
          const oldPrice = res.currentPrice;
          res.currentPrice = newPrice;
          res.changePercent = (newPrice - oldPrice) / oldPrice * 100;
          res.changePercent = Math.round(res.changePercent * 100) / 100;
          res.priceTable.push(newPrice);
          res.health += 1;
        }
        res.save().catch(err => console.log(err));

        const successEmbed = new EmbedBuilder()
          .setTitle('Stock Market!')
          .setDescription(`You have purchased ${quantity} ${stockname} for ${totalPrice} coins!`)
          .setColor('Green');
        return await interaction.reply({ embeds: [successEmbed] });
      });
    });
  }
}