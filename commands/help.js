const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Help command to show all commands'),
cooldowns : new Set(),
	    cooldown : 8,
	async execute(interaction) {
        const Helpy = new MessageEmbed()
	.setColor('RANDOM')
	.setTitle("Go no further! Help is on the way!")
	.setDescription(`**Help Menu:**

:wrench: **Misc:** /ping, /invite

:coin: **Economy:** /beg, /bal, /give, /deposit, /withdraw

:joy: **Fun:** /meme, /gayrate`)
	.setTimestamp()
		return interaction.reply({ embeds: [Helpy] });
	},
};
