const { SlashCommandBuilder } = require('@discordjs/builders');
const {  EmbedBuilder } = require('discord.js');
const schema = require("../models/userschema.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('work_set')
		.setDescription('set your job')
        .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("choose the category that you want to see")
        .setRequired(true)
        .addChoices(
            { name: 'Banker', value: 'banker' },
            { name: 'Accountant', value: 'accountant' },
            { name: 'Streamer', value: 'streamer' },
            { name: 'Taxi', value: 'taxi' },
            { name: 'Police', value: 'police' },
            { name: 'Cashier', value: 'cashier' },
          )),
cooldowns : new Set(),
	    cooldown : 8,
	async execute(interaction) {
        schema.findOne({
            userID: interaction.user.id
          }, async (err, res) => {
            if (err) console.log(err);
          if (!res) {
            return interaction.reply({content: "First time users need to use the bal command to start", ephemeral: true})
          }
          if (res.job !== "Unemployed") {
            return interaction.reply({content: "You already have a job", ephemeral: true})
          }


            if (res.job === "Unemployed") {
const choice = interaction.options.getString('category');

if (choice === "banker") {
    if (res.workxp < 300) {
        const work = new EmbedBuilder()
        .setColor('Random')
        .setTitle("Unable to employ")
        .setDescription("You need to work more to be able to become a banker")
        .setTimestamp()
        interaction.reply({ embeds: [work] });
    } else {
    res.job = "Banker";
    res.save();
    const bankerEmbed = new EmbedBuilder()
    .setTitle('Banker')
    .setDescription(`:moneybag: **Banker:** :moneybag:
    you have been hired as a banker!`)
    .setColor('Random')
    return await interaction.reply({embeds: [bankerEmbed]})
    }   

} else if (choice === "accountant") {
    if (res.workxp < 1000) {
        const work = new EmbedBuilder()
        .setColor('Random')
        .setTitle("Unable to employ")
        .setDescription("You need to work more to be able to become an accountant")
        .setTimestamp()
        interaction.reply({ embeds: [work] });
    } else {    
    res.job = "Accountant";
    res.save();
    const accountantEmbed = new EmbedBuilder()
    .setTitle('Accountant')
    .setDescription(`:moneybag: **Accountant:** :moneybag:
    you have been hired as an accountant!`)
    .setColor('RANDOM')
    return await interaction.reply({embeds: [accountantEmbed]})
    }
}
else if (choice === "streamer") {
    res.job = "Streamer";
    res.save();
    const streamerEmbed = new EmbedBuilder()
    .setTitle('Streamer')
    .setDescription(`:moneybag: **Streamer:** :moneybag:
    you have been hired as a streamer!`)
    .setColor('RANDOM')
    return await interaction.reply({embeds: [streamerEmbed]})
}
else if (choice === "taxi") {
    if (res.workxp < 200) {
        const work = new EmbedBuilder()
        .setColor('Random')
        .setTitle("Unable to employ")
        .setDescription("You need to work more to be able to become a taxi driver")
        .setTimestamp()
        interaction.reply({ embeds: [work] });
    } else {
    res.job = "Taxi";
    res.save();
    const taxiEmbed = new EmbedBuilder()
    .setTitle('Taxi')
    .setDescription(`:moneybag: **Taxi:** :moneybag:
    you have been hired as a Taxi driver!`)
    .setColor('Random')
    return await interaction.reply({embeds: [taxiEmbed]})
    }
}
else if (choice === "police") {
    if(res.workxp < 150) {
        const work = new EmbedBuilder()
        .setColor('Random')
        .setTitle("Unable to employ")
        .setDescription("You need to work more to be able to become a police officer")
        .setTimestamp()
        interaction.reply({ embeds: [work] });
    } else {
    res.job = "Police";
    res.save();
    const policeEmbed = new EmbedBuilder()
    .setTitle('Police')
    .setDescription(`:moneybag: **Police:** :moneybag:
    you have been hired as a police officer!`)
    .setColor('Random')
    return await interaction.reply({embeds: [policeEmbed]})
    }

} else if (choice === "cashier") {
    res.job = "Cashier";
    res.save();
    const cashierEmbed = new EmbedBuilder()
    .setTitle('Cashier')
    .setDescription(`:moneybag: **Cashier:** :moneybag:
    you have been hired as a cashier!`)
    .setColor('Random')
    return await interaction.reply({embeds: [cashierEmbed]})
}
            }
          });
    }
}