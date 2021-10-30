const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('beg')
		.setDescription('Beg to random people on the streets'),
cooldowns : new Set(),
	    cooldown : 15,
	async execute(interaction) {
  const user = interaction.options.getUser("user");
const responses = ["After a successful day of begging on the streets you managed to pull out a few coins", "A rich lady gave you a small amount of cash", "Pop Smoke gave you a bit of cash when he saw you at starbucks", "Your uncle gave you a early christmas present! "]
let Result = responses[Math.floor(Math.random() * responses.length)];
let amount = Math.floor(Math.random() * Math.floor(99));
db.add(`${interaction.user.username}_wallet`, amount)
        const pingy = new MessageEmbed()
	.setColor('RANDOM')
	.setTitle("You begged!")
	.setDescription(`**What happened:** ${Result}

**Earnings:** $${amount}`)
	.setTimestamp()
		return interaction.reply({ embeds: [pingy] });
	},
};