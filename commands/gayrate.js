const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('gayrate')
		.setDescription('How gay are you?'),
	cooldowns: new Set(),
	cooldown: 8,
	async execute(interaction) {
		const gay = Math.floor(Math.random() * Math.floor(100));
		if (interaction.user.id === "465945329968218144") {
			const gay = Math.floor(Math.random() * Math.floor(0));
			const pingy = new EmbedBuilder()
				.setColor('RANDOM')
				.setTitle("Gay Scale...")
				.setDescription(`You are scientificly proven to be ${gay}% gay`)
				.setTimestamp()
			return interaction.reply({ embeds: [pingy] });
		} else {
			const embed = new EmbedBuilder()
				.setTitle('Gay Scale...')
				.setDescription(`It is scientificly proven that you are ${gay}% gay`)
				.setColor('Random')
				interaction.reply({embeds: [embed]})
			
		}
	},
};
