const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const schema = require("../models/userschema.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to earn more money!'),
	cooldowns: new Set(),
	cooldown: 60,
	async execute(interaction) {
		schema.findOne({
			userID: interaction.user.id
		}, (err, res) => {
			if (err) console.log(err);
			if (!res) {
			interaction.reply({content: "First time users have to use the bal command to start", ephemeral: true})
			} else {
				if (res.job === "Unemployed") {
					interaction.reply({content: "You are unemployed and cannot work!", ephemeral: true})
				} else if (res.job === "Banker") {
					res.coins = res.coins + 300
					res.workxp = res.workxp + 20
					const bankerEmbed = new MessageEmbed()
						.setColor('RANDOM')
						.setTitle("Banker")
						.setDescription(`You worked as a banker and got paid 300 coins `)
						.setTimestamp()
					interaction.reply({ embeds: [bankerEmbed] });
					res.save()
				} else if (res.job === "Accountant") {
					res.coins = res.coins + 600
					res.workxp = res.workxp + 40
					const accountantEmbed = new MessageEmbed()
						.setColor('RANDOM')
						.setTitle("Accountant")
						.setDescription(`You worked as an accountant and got paid 600 coins `)
						.setTimestamp()
					interaction.reply({ embeds: [accountantEmbed] });
					res.save()
				} else if (res.job === "Streamer") {
					res.coins = res.coins + 100
					res.workxp = res.workxp + 5
					const streamerEmbed = new MessageEmbed()
						.setColor('RANDOM')
						.setTitle("Streamer")
						.setDescription(`You worked as a streamer and got paid 100 coins `)
						.setTimestamp()
					interaction.reply({ embeds: [streamerEmbed] });
					res.save()
				} else if (res.job === "Taxi Driver") {
					res.coins = res.coins + 200
					res.workxp = res.workxp + 20
					const taxiEmbed = new MessageEmbed()
						.setColor('RANDOM')
						.setTitle("Taxi Driver")
						.setDescription(`You worked as a taxi driver and got paid 200 coins `)
						.setTimestamp()
					interaction.reply({ embeds: [taxiEmbed] });
					res.save()
				} else if (res.job === "Police") {
					res.coins = res.coins + 200
					res.workxp = res.workxp + 15
					const policeEmbed = new MessageEmbed()
						.setColor('RANDOM')
						.setTitle("Police")
						.setDescription(`You worked as a police officer and got paid 200 coins `)
						.setTimestamp()
					interaction.reply({ embeds: [policeEmbed] });
					res.save()
				} else if (res.job === "Cashier") {
					res.coins = res.coins + 100
					res.workxp = res.workxp + 5
					const cashierEmbed = new MessageEmbed()
						.setColor('RANDOM')
						.setTitle("Cashier")
						.setDescription(`You worked as a cashier and got paid 100 coins `)
						.setTimestamp()
					interaction.reply({ embeds: [cashierEmbed] });
					res.save()
				}
				
			}
		});
	}
};
