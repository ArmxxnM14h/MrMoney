const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const schema = require("../models/userschema.js")
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

schema.findOne({
			userID: interaction.user.id
		}, (err, res) => {
			if (err) console.log(err);
			res.coins = res.coins + amount;
			res.save();
if(!res){
return interaction.reply({content: "First time users need to use the bal command to start", ephemeral: true})
}
        const work = new MessageEmbed()
	.setColor('RANDOM')
	.setTitle("You Worked")
	.setDescription(`**What happened:** ${Result}

**Earnings:** $${amount}`)
	.setTimestamp()
		 interaction.reply({ embeds: [work] });
	});
    }
};
