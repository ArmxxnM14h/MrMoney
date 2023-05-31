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
    const coinstoadd = amount;

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

      if (amount > 10) {
        response = "Damn, that's unlucky...";
      }
      if (amount > 20) {
        response = "At least it was worth it...";
      }
      if (amount > 30) {
        response = "You got lucky!";
      }
      if (amount > 40) {
        response = "You got really lucky!";
      }

      userSchema.coins += coinstoadd;
      await userSchema.save();

      const begEmbed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle(`${interaction.user.username} begged!`)
        .setDescription(`You begged everyone\n\nEarned: ${amount} coins!`)
        .setThumbnail(interaction.user.avatarURL())
        .setTimestamp();

      return interaction.reply({ embeds: [begEmbed] });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'An error occurred while begging.', ephemeral: true });
    }
  },

};

