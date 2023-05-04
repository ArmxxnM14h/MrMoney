const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const schema = require("../models/userschema")
module.exports = {
  data: new SlashCommandBuilder()
    .setName('passive')
    .setDescription('Enable/Disable passive settings')
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Choose to enable or disable")
        .setRequired(true)
        .addChoices(
          { name: '✅ Enable', value: 'enab' },
          { name: '❌ Disable', value: 'disab' },
        )),
    
  cooldowns: new Set(),
  cooldown: 8,
  async execute(interaction) {
    const choice = interaction.options.getString('option');
    schema.findOne({
      userID: interaction.user.id
    }, async (err, res) => {
      if (err) console.log(err);

      if (!res) {
        const errEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('An error has occured')
          .setFooter('Contact Support.')
          .setColor('Red')
          return interaction.reply({embeds: [errEmbed], ephemeral: true})
      }
    if (choice === "disab"){
if (res.passive === "disabled"){
  interaction.reply({content: "Passive is already disabled", ephemeral: true})
} else {
  res.passive = "disabled"
  res.save();
  const DisabledEmbed = new EmbedBuilder() 
  .setTitle('Sucess')
  .setDescription("Passive set to `DISABLED`")
  .setColor('Green')
  interaction.reply({embeds: [DisabledEmbed]})
}
    } else if (choice === "enab") {
      msg = 'Enable the passive....'
      if(res.passive === "enabled"){
        return interaction.reply({content: "Passive is already enabled", ephemeral: true})
      } else {
        res.passive = "enabled"
        res.save();
      const enabledEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setDescription("Passive set to `ENABLED`")
        .setColor('Green')
      return await interaction.reply({ embeds: [enabledEmbed] })
      }
    }
  })
  
    } 
  }

