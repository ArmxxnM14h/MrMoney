// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something..")
    .addStringOption((option) =>
      option
        .setName("words")
        .setDescription("choose the words you want the bot to say")
        .setRequired(true)
    ),
cooldowns : new Set(),
cooldown : 5, 
// Executing the interaction and defining nessessery stuff
  async execute(interaction) {
const user = interaction.options.getUser("user")
  
   const say = interaction.options.getString("words");

// Entirely new embed
      const balEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Hm, A user has executed /say`)
        .setDescription(`User: **${interaction.user.username}** 

Content: ${say}`)
        .setTimestamp();
        
      await interaction.reply({ embeds: [balEmbed] });
  }
}