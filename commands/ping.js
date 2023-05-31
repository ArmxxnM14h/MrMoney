const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ColorsResolvable = require('discord.js')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping, pong, am I online?'),
	cooldowns: new Set(),
	cooldown: 5,
	async execute(interaction) {
		const ping = interaction.client.ws.ping;
		const pingy = new EmbedBuilder()
			.setColor('Random')
			.setTitle("Wait a second.. Ping?")
			.setDescription(`WOAH My response time is \`${ping} ms\``)
			.setTimestamp()
		return interaction.reply({ embeds: [pingy] });
	
	},
};