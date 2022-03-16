const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('gayrate')
		.setDescription('How gay are you?'),
cooldowns : new Set(),
	    cooldown : 8,
	async execute(interaction, client) {
const gay = Math.floor(Math.random() * Math.floor(100));
if(interaction.user.id === "465945329968218144" gay = "0%")
        const pingy = new MessageEmbed()
	.setColor('RANDOM')
	.setTitle("Gay Scale...")
	.setDescription(`You are scientificly proven to be ${gay}% gay`)
	.setTimestamp()
		return interaction.reply({ embeds: [pingy] });
	},
};
