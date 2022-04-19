const userschema = require("../models/userschema.js");
const stockschema = require("../models/stockschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stock_sell")
    .setDescription("Sell stocks or cryptos you have bought!")
    .addStringOption((option) =>
      option
        .setName("stockname")
        .setDescription("The stock or crypto you want to sell.")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("The no. of stocks you want to sell.")
        .setRequired(true),
    ),
  cooldowns: new Set(),
  cooldown: 5,

  async execute(interaction) {
    const stockname = interaction.options.getString("stockname");
    const quantity = interaction.options.getInteger("quantity");

    if (quantity < 1) {
      return await interaction.reply("Mf what are you doing!! If you cant sell at least one stock then why are you selling?");
    }

    userschema.findOne({
      userID: interaction.user.id
    }, async (usererr, userres) => {
      if(usererr) console.log(err);

      if(!userres) {
        const errEmbed = new MessageEmbed()
          .setTitle('Error...')
          .setDescription('First time users must execute the bal command before using other commands')
          .setColor('RED');
        return await interaction.reply({ embeds: [errEmbed] });
      }

      const notEnoughStock = userres.inventory.filter(item => item.name === stockname && item.count < quantity);

      if(notEnoughStock.length != 0) {
        const errEmbed = new MessageEmbed()
          .setTitle('Error...')
          .setDescription('You dont have that many stocks to sell!')
          .setColor('RED');
        return await interaction.reply({ embeds: [errEmbed] });
      }

      if (userres.inventory.some(item => item.name == stockname)) {
        userres.inventory.forEach(async item => {
          if (item.name == stockname) {
            if (item.count > quantity) {
              item.count -= quantity;
            } else if(item.count == quantity) {
              userres.inventory.splice(userres.inventory.indexOf(item), 1);
            }
          }
        });
        await userres.save().catch(err => console.log(err));
      } else {
        const errEmbed = new MessageEmbed()
          .setTitle('Error...')
          .setDescription('You dont own that stock or crypto!')
          .setColor('RED');
        return await interaction.reply({ embeds: [errEmbed] });
      }

      stockschema.findOne({
        stockName: stockname
      }, async (stockerr, stockres) => {
        if (stockerr) console.log(err);

        if (!stockres) {
          const errEmbed = new MessageEmbed()
            .setTitle('Error...')
            .setDescription('That stock or crypto does not exist!')
            .setColor('RED');
          return await interaction.reply({ embeds: [errEmbed] });
        }

        const totalPrice = stockres.currentPrice * quantity;

        userres.coins += totalPrice;
        userres.save().catch(err => console.log(err));

        stockres.volume = stockres.volume + quantity;
        stockres.save().catch(err => console.log(err));

        const embed = new MessageEmbed()
          .setTitle('Success!')
          .setDescription(`You sold ${quantity} ${stockname} for ${totalPrice} coins!`)
          .setColor('GREEN');
        return await interaction.reply({ embeds: [embed] });
      });
    });
  }
}