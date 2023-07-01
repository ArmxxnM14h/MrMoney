const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');
const schema = require("../models/userschema.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work to earn more money!'),
		cooldown: {
            duration: 3600, // Set the cooldown duration in seconds
          },
	async execute(interaction) {
		const res = await schema.findOne({ userID: interaction.user.id })
		
			if (!res) {
				const errEmbed = new EmbedBuilder()
				.setTitle('Error')
				.setDescription('An error has occured')
				.setFooter('Contact Support.')
				.setColor('Red')
				return interaction.reply({embeds: [errEmbed], ephemeral: true})

		// rewritting soon....
			}
		}
	}
