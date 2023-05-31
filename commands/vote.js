const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Vote CoinHome on top.gg now!'),
		cooldown: {
            duration: 4, // Set the cooldown duration in seconds
          },
	async execute(interaction) {
		const botAdd = `[here](https://top.gg/bot/896727173136809994
)`
		const pingy = new EmbedBuilder()
			.setColor('RANDOM')
			.setTitle("Vote for MrMoney!")
			.setDescription(`Thanks for voting for us, 

Top.gg: ${botAdd}`)
			.setTimestamp()
		return interaction.reply({ embeds: [pingy] });
	},
};