const schema = require("../models/userschema.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const colors = require('discord.js')
// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Get your balance or another user's balance!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Get another user's balance!")
        .setRequired(false),

    ),
  cooldowns: new Set(),
  cooldown: 5,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (user) {
    
     const userSchema1 = await schema.findOne({ userID: user.id })

        if (!userSchema1) {
          const errEmbed = new EmbedBuilder()
            .setDescription(`${user.username} hasn't used the bot yet!!`)
            .setTimestamp()
            .setColor('Red');
          // Reply to the entire interaction
          await interaction.reply({ embeds: [errEmbed] });
        } else {
          const networth = userSchema1.bank + userSchema1.coins
          const balEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s Balance`)
            .setDescription(`:purse: Wallet: **$${userSchema1.coins}**
            
:bank: Bank: **$${userSchema1.bank}** 

:money_mouth: Networth **$${networth}**`)
            .setTimestamp()
            .setColor('Green')
          // Reply to the entire interaction
          await interaction.reply({ embeds: [balEmbed] });
        }

  } else {
    const userSchema2 = await schema.findOne({ userID: interaction.user.id })

        if (!userSchema2) { 

          const errEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('An error has occured')
          .setFooter('Contact Support.')
          .setColor('Red')
          return interaction.reply({embeds: [errEmbed]})

       } else {
          const nw = userSchema2.coins + userSchema2.bank
          const balEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Balance`)
            .setDescription(`:purse: Wallet: **$${userSchema2.coins}**

:bank: Bank: **$${userSchema2.bank}**

:money_mouth: Networth: **$${nw}**`)
            .setTimestamp()
            .setColor('Green')
          // Reply to the entire interaction
          await interaction.reply({ embeds: [balEmbed] });
        }
      }
    }
  }
