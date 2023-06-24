const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const schema = require("../models/userschema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg to random people on the streets'),
    cooldown: {
      duration: 15, // Set the cooldown duration in seconds
    },
  async execute(interaction) {
    const preson = ['Donald Trump', 'Joe Biden', 'Boris Johnson', 'Rishi Sunak', 'Jake Paul', 'KSI', 'Tommy Fury', 'Willy Wonka', 'TommyInnit', 'Dream', 'AliA']
    const person = preson[Math.floor(Math.random() * preson.length)];
    
    const min = 25;
    const max = 250;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const coinstoadd = randomNumber;
    try {
      const userSchema = await schema.findOne({ userID: interaction.user.id });

      if (!userSchema) {
        const errEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('An error has occurred')
          .setFooter('Contact Support.')
          .setColor('Red');

        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }

      

      userSchema.coins += coinstoadd;
      await userSchema.save();

      const begEmbed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`${interaction.user.username} begged!`)
        .setDescription(`You begged ${person}\n\nEarned: ${randomNumber} coins!`)
        .setTimestamp();

      return interaction.reply({ embeds: [begEmbed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'An error occurred while begging.', ephemeral: true });
    }
  },
}