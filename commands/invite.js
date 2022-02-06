const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('invite the bot'),
	cooldowns: new Set(),
	cooldown: 5,
	async execute(interaction) {
		const botAdd = `[Thank you for adding me!](https://discord.com/api/oauth2/authorize?client_id=896727173136809994&permissions=0&scope=bot%20applications.commands
)`
		const pingy = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle("Invite Link!")
			.setDescription(botAdd)
			.setTimestamp()
		return interaction.reply({ embeds: [pingy] });
	},
};