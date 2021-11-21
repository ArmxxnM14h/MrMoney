// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("rob from the people of Mr Money")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The person you want to rob from")
        .setRequired(true)
),
        cooldowns : new Set(),
	    cooldown : 5,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const bal = db.fetch(`${user.username}_wallet`);
const AttemptedRobbery = db.fetch(`${interaction.user.username}_wallet`)
    const chance = Math.floor(Math.random() * Math.floor(100));
  if (interaction.user.id === user.id) return;
   else if (bal < 50) {
      const AnotherOne = new MessageEmbed()
        .setTitle("Bruh..")
        .setDescription(
          `Why are you robbing users with a balance of less then 50??`
        )
        .setColor("RANDOM");

      await interaction.reply({ embeds: [AnotherOne], ephemeral: true });
    } else if (AttemptedRobbery < 500) {
const BrokeBoi = new MessageEmbed()
.setTitle('Your broke')
.setDescription(`You need minimum $500 in your wallet to rob dude`)
.setColor('RANDOM')
await interaction.reply({embeds: [BrokeBoi]})
} else if (chance < 50) {
      const ErrorEmbed = new MessageEmbed()
        .setTitle("Yikes...")
        .setDescription(
          "You really failed the robbery and lost a total of $500")
        .setColor("RANDOM");
 db.subtract(`${interaction.user.username}_wallet`, 500)
      await interaction.reply({ embeds: [ErrorEmbed]});
    } else if (chance > 50) {
      // Entirely new embed
const Ampro = Math.floor(Math.random() * Math.floor(bal));
      const RobberySuccess = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Success!`)
        .setDescription(
          `You robbed a ${user.username} of $${Ampro}, you are so sad..`
        )
        .setTimestamp();
      await interaction.reply({ embeds: [RobberySuccess] });
db.subtract(`${user.username}_wallet`, Ampro)
    } 
  },
};