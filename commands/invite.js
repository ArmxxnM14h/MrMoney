const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Invite MrMoney to your guild!'),
		cooldown: {
            duration: 2, // Set the cooldown duration in seconds
          },
	async execute(interaction) {
		const botAdd = `[Thank you for adding me!](https://discord.com/api/oauth2/authorize?client_id=896727173136809994&permissions=0&scope=bot%20applications.commands
)`
		const pingy = new EmbedBuilder()
			.setColor('Random')
			.setTitle("Invite Link!")
			.setDescription(botAdd)
			.setTimestamp()
		return interaction.reply({ embeds: [pingy] });
	},
};