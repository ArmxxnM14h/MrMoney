const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const schema = require("../models/stockschema.js");
const Chart = require('quickchart-js');
const ms = require("../utils/humanify-ms.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stockinfo')
		.setDescription('View info about the current stocks.')
		.addStringOption((option) =>
			option
				.setName("stockname")
				.setDescription("View more details about a stock")
				.setRequired(false),
		),
	cooldowns: new Set(),
	cooldown: 5,
	async execute(interaction) {
		const stockinfo = interaction.options.getString("stockname");

		if (!stockinfo) {
			schema.find({}, async (err, res) => {
				if (err) console.log(err);
				const stockembed = new MessageEmbed()
					.setTitle("Stock Info")
					.setColor("#0099ff")
					.setDescription("**Here are the current stocks:**")
					.setFooter({text: `Last updated: ${ms(Date.now() - global.stockLastUpdated)} ago`});

				for (let i = 0; i < res.length; i++) {
					stockembed.addField(`${i + 1}. ${res[i].stockName}`, `Stock ID: ${res[i].stockID}\nCurrent Price: $${res[i].currentPrice}\nChange Percent: ${res[i].changePercent}%\nVolume: ${res[i].volume}`, true);
				}

				return await interaction.reply({ embeds: [stockembed] });
			});
		} else if (stockinfo) {
			schema.findOne({
				stockName: stockinfo
			}, async (err, res) => {
				if (err) console.log(err);

				if (!res) {
					return await interaction.reply("That stock does not exist.");
				}

				const stockembed = new MessageEmbed()
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
			})
		}
	},
};