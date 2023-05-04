const schema = require("../models/userschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');
// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("work_quit")
    .setDescription("quit your job"),
    cooldowns: new Set(),
    cooldown: 5,
    execute(interaction) {
        schema.findOne({
            userID: interaction.user.id
        }, (err, res) => {
            if (!res) {
                const errEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('An error has occured')
          .setFooter('Contact Support.')
          .setColor('Red')
          return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }
            if (err) console.log(err);
            
            if (res.job === "unemployed") {
                const errEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`${interaction.user.username} hasn't got a job yet!!`)
                    .setTimestamp();
                interaction.reply({ embeds: [errEmbed] });
            } else {
        const quitJob = new EmbedBuilder()
        .setColor('Random')
        .setTitle("You Quit Your Job")
        .setDescription(`You quit your job as a ${res.job}... You're not working anymore`)
        .setTimestamp()
        interaction.reply({ embeds: [quitJob] });
res.job = "Unemployed";
res.save();
            }

        });
 }
}
