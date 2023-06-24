const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('join the support server'),
		cooldown: {
            duration: 4, // Set the cooldown duration in seconds
          },
	async execute(interaction) {
		const botAdd = `[Join our support server!](https://discord.gg/kw4YZJ5j3u
)`
		const pingy = new EmbedBuilder()
			.setColor('Random')
			.setTitle("Official Support!")
			.setDescription(botAdd)
			.setTimestamp()
		return interaction.reply({ embeds: [pingy] });
	},
};