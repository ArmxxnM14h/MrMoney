const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const schema = require("../models/stockschema.js");

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

    if(!stockinfo) {
			schema.find({}, async (err, res) => {
				if (err) console.log(err);
				const stockembed = new MessageEmbed();

				for(let i = 0; i < res.length; i++) {
					stockembed.addField(`${res[i].stockID}`, `${res[i].currentprice}`);
				}

				return await interaction.reply({ embeds: [stockembed] });
			});
		}
	},
};