const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const schema = require("../models/userschema.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('beg')
		.setDescription('Beg to random people on the streets'),
	cooldowns: new Set(),
	cooldown: 15,
	async execute(interaction) {
		let amount = Math.floor(Math.random() * Math.floor(50 + 1));
		const coinstoadd = amount

	    schema.findOne({
			userID: interaction.user.id
		}, (err, res) => {
			if (err) console.log(err);

			if (!res) {
				const errEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('An error has occured')
          .setFooter('Contact Support.')
          .setColor('Red')
          return interaction.reply({embeds: [errEmbed], ephemeral: true})
			} 
		
	
if (amount > 10) {
	response = "Damn thats unlucky..."
}
if (amount > 20) {
	response = "At least it was worth it..."
}
if (amount > 30) {
	response = "You got lucky!"
}
if (amount > 40) {
	response = "You got really lucky!"
}
res.coins = res.coins + coinstoadd;
			res.save();
		const begEmbed = new EmbedBuilder()
			.setColor('Aqua')
			.setTitle(`${interaction.user.username} begged!`)
			.setDescription(`You begged everyone
			
			Earned: ${amount} coins!
			`)
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp()
			
        return interaction.reply({embeds: [begEmbed]})
	});
}
};