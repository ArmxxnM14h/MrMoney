const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to earn more money!'),
cooldowns : new Set(),
	    cooldown : 60,
	async execute(interaction) {
  const user = interaction.options.getUser("user");
const responses = ["You worked at your uncles corner shop and earned quite a lot of money :money_mouth: ", "You worked at trapstar and earned a bit more cash", "You worked at CoinHome and earned a small amount of cash ", "Polo G gave you a bit of cash for recording his music video"]
let Result = responses[Math.floor(Math.random() * responses.length)];
let amount = Math.floor(Math.random() * 800) + 1
db.add(`${interaction.user.username}_wallet`, amount) 
        const work = new MessageEmbed()
	.setColor('RANDOM')
	.setTitle("You Worked")
	.setDescription(`**What happened:** ${Result}

**Earnings:** $${amount}`)
	.setTimestamp()
		await interaction.reply({ embeds: [work] });
	},
};