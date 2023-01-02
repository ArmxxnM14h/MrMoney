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
if (amount > 10) {
	response = "Damn thats unlucky..."
}
if (amount > 20) {
	response = "At least it was worth it..."
}
if (amount > 30) {
	response = "You got lucky!"
}
if (amount > 40) {
	response = "You got really lucky!"
}
		const begEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${interaction.user.username} begged!`)
			.setDescription(`You begged everyone
			
			Earned: ${amount} coins!
			
			${response}`)
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp()
        return interaction.reply({embeds: [begEmbed]})
	},
};
