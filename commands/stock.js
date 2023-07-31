const { SlashCommandBuilder } = require('@discordjs/builders');
const {  EmbedBuilder } = require('discord.js');
const userschema = require("../models/userschema.js");
const stockschema = require("../models/stockschema.js");
const Chart = require('quickchart-js')
const ms = require('ms')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stock')
		.setDescription('Options for stock commands!')
    .addSubcommand(group => group.setName('buy').setDescription('Buy totally amazing stock.')
      .setName('buy')
      .setDescription('buy the amazing stock.')
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
    ))
    .addSubcommand(group => group.setName('sell').setDescription('Sell stock for a quick profit')
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
  ))
        .addSubcommand(group => group.setName('info').setDescription('Check out the status of stock.')
        .addStringOption((option) =>
			option
				.setName("stockname")
				.setDescription("View more details about a stock")
				.setRequired(false),
		)),
        cooldown: {
            duration: 5, // Set the cooldown duration in seconds
          },
        async execute(interaction) {
            const command = interaction.options.getSubcommand();
            const ms = require('ms')
            
            switch (command) {
                case 'buy':
                  const stockname = interaction.options.getString("stockname");
                  const quantity = interaction.options.getInteger("quantity");
              
                  if (quantity < 1) {
                    return await interaction.reply("Mf what are you doing!! You can't buy less than 1 stock.");
                  }
              
                  const res = await stockschema.findOne({ stockName: stockname })
              
                  if (!res) {
                    const errEmbed = new EmbedBuilder()
                      .setTitle('Error...')
                      .setDescription('That stock or crypto does not exist!')
                      .setColor('Red');
                    return await interaction.reply({ embeds: [errEmbed] });
                  }
              
                  const userres = await userschema.findOne({ userID: interaction.user.id })
              
                  if (!userres) {
                    const errEmbed = new EmbedBuilder()
                      .setTitle('An error has occurred')
                      .setDescription('Please contact support.')
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
              
                  userres.coins = userres.coins - totalPrice; // Deduct the total price from the user's coins
                  userres.save().catch(err => console.log(err));
              
                  // No need to change the rest of the code since we want the change percent and stock price to continue fluctuating over time.
              
                  const successEmbed = new EmbedBuilder()
                    .setTitle('Stock Market!')
                    .setDescription(`You have purchased ${quantity} ${stockname} for ${totalPrice} coins!`)
                    .setColor('Green');
                  return await interaction.reply({ embeds: [successEmbed] })
              }
              

            switch(command){
                case 'sell':
                    const stockname = interaction.options.getString("stockname");
                    const quantity = interaction.options.getInteger("quantity");
                
                    if (quantity < 1) {
                      return await interaction.reply("Mf what are you doing!! If you cant sell at least one stock then why are you selling?");
                    }
                
                   const userres = await userschema.findOne({ userID: interaction.user.id })
                
                
                      if(!userres) {
                        const errEmbed = new EmbedBuilder()
                          .setTitle('Error')
                          .setDescription('An error has occured')
                          .setFooter('Contact Support.')
                          .setColor('Red')
                          return interaction.reply({embeds: [errEmbed], ephemeral: true})
                      }
                
                      const notEnoughStock = userres.inventory.filter(item => item.name === stockname && item.count < quantity);
                
                      if(notEnoughStock.length != 0) {
                        const errEmbed = new EmbedBuilder()
                          .setTitle('Error...')
                          .setDescription('You dont have that many stocks to sell!')
                          .setColor('Red');
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
                        const errEmbed = new EmbedBuilder()
                          .setTitle('Error...')
                          .setDescription('You dont own that stock or crypto!')
                          .setColor('Red');
                        return await interaction.reply({ embeds: [errEmbed] });
                      }
                
                  const stockres = await stockschema.findOne({ stockName: stockname })
                   
                        if (!stockres) {
                          const errEmbed = new EmbedBuilder()
                            .setTitle('Error...')
                            .setDescription('That stock or crypto does not exist!')
                            .setColor('Red');
                          return await interaction.reply({ embeds: [errEmbed] });
                        }
                
                        const totalPrice = stockres.currentPrice * quantity;
                
                        userres.coins += totalPrice;
                        userres.save().catch(err => console.log(err));
                
                        stockres.volume = stockres.volume + quantity;
                        stockres.save();
                
                        const embed = new EmbedBuilder()
                          .setTitle('Success!')
                          .setDescription(`You sold ${quantity} ${stockname} for ${totalPrice} coins!`)
                          .setColor('Green');
                        return await interaction.reply({ embeds: [embed] });
                      
            }


            switch(command){
                case 'info':
                    const stockinfo = interaction.options.getString("stockname");

		if (!stockinfo) {
		const res = await stockschema.find({}) 
				const stockembed = new EmbedBuilder()
					.setTitle("Stock Info")
					.setColor("#0099ff")
					.setDescription("**Here are the current stocks:**")
					global.stockLastUpdated ? stockembed.setFooter({text: `Last updated: ${ms(Date.now() - global.stockLastUpdated)} ago`}) : "";

				for (let i = 0; i < res.length; i++) {
					stockembed.addFields({ name: `${i + 1}. ${res[i].stockName}`, value: `Stock ID: ${res[i].stockID}\nCurrent Price: $${res[i].currentPrice}\nChange Percent: ${res[i].changePercent}%\nVolume: ${res[i].volume}`, inline: true});
				}

				return await interaction.reply({ embeds: [stockembed] });
		} else if (stockinfo) {
		const res = await stockschema.findOne({ stockName: stockinfo })

				if (!res) {
					return await interaction.reply("That stock does not exist.");
				}

				const stockembed = new EmbedBuilder()
					.setTitle(res.stockName)
					.setColor("#0099ff")
					.setDescription(`**Stock ID:** ${res.stockID}\n**Current Price:** $${res.currentPrice}\n**Change Percent:** ${res.changePercent}%\n**Volume:** ${res.volume}`);
				
				let trimmedTable;
				if(res.priceTable.length > 100) {
					 trimmedTable = res.priceTable.slice(-100);
				} else (trimmedTable = res.priceTable);

				const chart = new Chart();
				chart
					.setConfig({
						type: 'line',
						data: {
							labels: trimmedTable.map((_, i) => i),
							datasets: [
								{
									label: "Price",
									data: trimmedTable
								}
							]
						},
					})
					.setWidth(800)
					.setHeight(400)
					.setBackgroundColor('white');

				const charturl = await chart.getShortUrl();
				stockembed.setImage(charturl);

				return await interaction.reply({ embeds: [stockembed] });
			}
		}
            }
        }
