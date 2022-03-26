const schema = require("../models/userschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("quitjob")
    .setDescription("quit your job"),
    cooldowns: new Set(),
    cooldown: 5,
    execute(interaction) {
        schema.findOne({
            userID: interaction.user.id
        }, (err, res) => {
            if (!res) {
                interaction.reply({content: "first time users need to use the bal command to start", ephemeral: true})
            }
            if (err) console.log(err);
            
            if (res.job === "Unemployed") {
                const errEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`${interaction.user.username} hasn't got a job yet!!`)
                    .setTimestamp();
                interaction.reply({ embeds: [errEmbed] });
            } else {
        const quitJob = new MessageEmbed()
        .setColor('RANDOM')
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
