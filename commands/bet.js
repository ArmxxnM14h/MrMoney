// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
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
        const errEmbed = new MessageEmbed()
          .setTitle('Error...')
          .setDescription('First time users must execute the bal command before using other commands')
          .setColor('RANDOM')
        
        return interaction.reply({ embeds: [errEmbed] });
      }
      if (amount <= 0) {
        const Abuser = new MessageEmbed()
          .setTitle('Lmao you tried abusing the system')
          .setDescription('Why you tryna abuse the system dude... What have i done to you')
          .setColor('RANDOM')
        await interaction.reply({ embeds: [Abuser], ephemeral: true })

      } else if (res.coins < amount) {
        const AnotherOne = new MessageEmbed()
          .setTitle("Bruh..")
          .setDescription(
            `Why are you betting more then what you have in balance??`)

          .setColor("RANDOM");

        await interaction.reply({ embeds: [AnotherOne], ephemeral: true });

      } else if (chance < 50) {
        res.coins = res.coins - amount;
        //Checking if you won or not, reduce a bit of ping with this ig
        const OOF = new MessageEmbed()
          .setTitle('You bet some cash, hope you win')
          .setDescription(`Checking your bet...`)
          .setColor('RANDOM')
        await interaction.reply({ embeds: [OOF] })

        await wait(2000);

        const OOF1 = new MessageEmbed()
          //Lmao they lost LOOOOOSERS
          .setTitle('Your bet failed')
          .setDescription(`Betting Info

Amount bet: ${amount}

Status: Lost

Current Balance: ${res.coins}`)
          .setColor('RANDOM')
        await interaction.editReply({ embeds: [OOF1] });
        res.save();

      } else if (chance > 50) {
        res.coins = res.coins + amount;
        const winningBet = new MessageEmbed()
          .setTitle('You bet some cash, hope you win')
          .setDescription(`Checking your bet...`)
          .setColor('RANDOM')
        await interaction.reply({ embeds: [winningBet] })

        await wait(2000);

        const winningBet1 = new MessageEmbed()
          .setTitle('Your bet WON!')
          .setDescription(`
Betting Info

Amount bet: ${amount}

Status: Won

Current Balance: ${res.coins}`)

          .setColor('RANDOM')
        await interaction.editReply({ embeds: [winningBet1] });
        res.save();
      }
    });
  },
};