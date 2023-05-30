const schema = require("../models/userschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');
// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check your profile!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Check another user's profile!")
        .setRequired(true),

    ),
  cooldowns: new Set(),
  cooldown: 5,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    if (user){
     const res = await schema.findOne({ userID: user.id })
    
            if (!res) {
            const errEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`${user.username} hasn't used the bot yet!!`)
                .setTimestamp();
    
            // Reply to the entire interaction
            await interaction.reply({ embeds: [errEmbed] });
            } else {
            const balEmbed = new EmbedBuilder()
                .setColor("Green")
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
        };
    }
  }

