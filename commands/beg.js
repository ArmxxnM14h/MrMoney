const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const schema = require("../models/userschema.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('beg')
		.setDescription('Beg to random people on the streets'),
	cooldowns: new Set(),
	cooldown: 15,
	async execute(interaction) {
		const user = interaction.options.getUser("user");
		const responses = ["After a successful day of begging on the streets you managed to pull out a few coins", "A rich lady gave you a small amount of cash", "Pop Smoke gave you a bit of cash when he saw you at starbucks", "Your uncle gave you a early christmas present! "]
		let Result = responses[Math.floor(Math.random() * responses.length)];
		let amount = Math.floor(Math.random() * Math.floor(99));
		const coinstoadd = amount

		schema.findOne({
			userID: interaction.user.id
		}, (err, res) => {
			if (err) console.log(err);
			res.coins = res.coins + coinstoadd;
			res.save();
if(!res){
return interaction.reply({content: "First time users need to use the bal command to start"})
}
		});

		const pingy = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle("You begged!")
			.setDescription(`**What happened:** ${Result}
**Earnings:** $${amount}`)
			.setTimestamp()
		return interaction.reply({ embeds: [pingy] });
	},
};