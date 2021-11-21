// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const wait = require('util').promisify(setTimeout);
const db = require("quick.db");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("bet")
    .setDescription("bet money to become rich")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("amount you wanna bet..")
        .setRequired(true)
),
        cooldowns : new Set(),
	    cooldown : 5,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    const bal = db.fetch(`${interaction.user.username}_wallet`);
    const chance = Math.floor(Math.random() * Math.floor(100));
if (amount <= 0) {
const Abuser = new MessageEmbed()
.setTitle('Lmao you tried abusing the system')
.setDescription('Why you tryna abuse the system dude... What have i done to you')
.setColor('RANDOM')
await interaction.reply({embeds: [Abuser], ephemeral: true})
} else if (bal < amount) {
      const AnotherOne = new MessageEmbed()
        .setTitle("Bruh..")
        .setDescription(
          `Why are you betting more then what you have in balance??`)
        
        .setColor("RANDOM");

      await interaction.reply({ embeds: [AnotherOne], ephemeral: true });

    } else if (chance < 50) {

//Checking if you won or not, reduce a bit of ping with this ig
const OOF = new MessageEmbed()
.setTitle('You bet some cash, hope you win')
.setDescription(`Checking your bet...`)
.setColor('RANDOM')
await interaction.reply({embeds: [OOF]})

await wait(2000);

const OOF1 = new MessageEmbed()
//Lmao they lost LOOOOOSERS
.setTitle('Your bet failed')
.setDescription(`Unfortunately you failed your bet meaning you lost $${amount}`)
.setColor('RANDOM')
await interaction.editReply({ embeds: [OOF1] });
db.subtract(`${interaction.user.username}_wallet`, amount)

} else if (chance > 50) {

      const winningBet = new MessageEmbed()
  .setTitle('You bet some cash, hope you win')
.setDescription(`Checking your bet...`)
.setColor('RANDOM')
await interaction.reply({embeds: [winningBet]})

await wait(2000);

const winningBet1 = new MessageEmbed()
.setTitle('Your bet WON!')
.setDescription(`Your bet won which means that you won $${amount}, enjoy your cash!`)
.setColor('RANDOM')
await interaction.editReply({ embeds: [winningBet1] });
db.add(`${interaction.user.username}_wallet`, amount)
    } 
  },
};