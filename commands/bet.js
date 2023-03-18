// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const schema = require("../models/userschema.js");
const wait = require('util').promisify(setTimeout);
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
  cooldowns: new Set(),
  cooldown: 5,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    const chance = Math.floor(Math.random() * Math.floor(100));

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
      if (amount <= 0) {
        const Abuser = new EmbedBuilder()
          .setTitle('Unable to gamble')
          .setDescription('You cannot gamble anything below one.')
          .setColor('Red')
        await interaction.reply({ embeds: [Abuser], ephemeral: true })

      } else if (res.coins < amount) {
        const AnotherOne = new EmbedBuilder()
          .setTitle("Cannot gamble")
          .setDescription(
            `You cannot gamble anything more then what you have.`)

          .setColor("Red");

        await interaction.reply({ embeds: [AnotherOne], ephemeral: true });
          } else if (res.coins  > amount){
        const OOF = new EmbedBuilder()
        .setTitle('You bet some cash, hope you win')
        .setDescription(`Checking your bet...`)
        .setColor('Yellow')
      await interaction.reply({ embeds: [OOF] })

      await wait(2000);
      if (chance < 50) {
        res.coins = res.coins - amount;

        const OOF1 = new EmbedBuilder()
   
          .setTitle('Your bet failed')
          .setDescription(`Betting Info

Amount bet: ${amount}

Status: Lost

Current Balance: ${res.coins}`)
          .setColor('Red')
        await interaction.editReply({ embeds: [OOF1] });
        res.save();
      } else if (chance > 50) {
        res.coins = res.coins + amount;
      
        const winningBet1 = new EmbedBuilder()
        .setTitle('Your bet WON!')
        .setDescription(`
Betting Info

Amount bet: ${amount}

Status: Won

Current Balance: ${res.coins}`)

        .setColor('Green')
      await interaction.editReply({ embeds: [winningBet1] });
      res.save();
      
      }
    }
    });
  },
};
