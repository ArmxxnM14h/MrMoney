const schema = require("../models/userschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check your profile!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Check another user's profile!")
        .setRequired(false),

    ),
  cooldowns: new Set(),
  cooldown: 5,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    if (user){
        schema.findOne({
            userID: user.id
        }, async (err, res) => {
            if (err) console.log(err);
    
            if (!res) {
            const errEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`${user.username} hasn't used the bot yet!!`)
                .setTimestamp();
    
            // Reply to the entire interaction
            await interaction.reply({ embeds: [errEmbed] });
            } else {
            const balEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`${user.username}'s Profile`)
                .setThumbnail(user.avatarURL())
                .setDescription(`Job: **${res.job}**
                
                XP: **${res.workxp}**
                
                :purse: Wallet: **$${res.coins}**
                
                :bank: Bank: **$${res.bank}**
                
                :money_mouth: Networth **$${res.bank + res.coins}**
                
                `)

                .setTimestamp();
    
            // Reply to the entire interaction
            await interaction.reply({ embeds: [balEmbed] });
            }
        });
    }
  }
}
