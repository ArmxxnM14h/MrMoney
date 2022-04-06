const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const schema = require("../models/userschema.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('beg')
		.setDescription('Beg to random people on the streets'),
	cooldowns: new Set(),
	cooldown: 15,
	async execute(interaction) {
		let amount = Math.floor(Math.random() * Math.floor(50 + 1));
		const coinstoadd = amount

		schema.findOne({
			userID: interaction.user.id
		}, (err, res) => {
			if (err) console.log(err);
			res.coins = res.coins + coinstoadd;
			res.save();
			if (!res) {
				return interaction.reply({ content: "First time users need to use the bal command to start" })
			}
		});

		const begEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${interaction.user.username} begged!`)
			.setDescription(`${interaction.user.username} begged  and earned ${amount} coins!`)
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp()
			.setFooter('Beta Version 1.0.0');
        return interaction.reply({embeds: [begEmbed]})
	},
};