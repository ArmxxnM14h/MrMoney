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
    cooldown: {
      duration: 180, // Set the cooldown duration in seconds
    },
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    const chance = Math.floor(Math.random() * Math.floor(100));

   const userSchema = await schema.findOne({ userID: interaction.user.id })
      if (!userSchema) {

        const errEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('An error has occured')
          .setFooter('Contact Support.')
          .setColor('Red')
          return interaction.reply({embeds: [errEmbed], ephemeral: true})
      }
      if (amount <= 0) {
        const Abuser = new EmbedBuilder()
          .setTitle('Cannot Gamble')
          .setDescription('You cannot gamble anything below one.')
          .setColor('Red')
        await interaction.reply({ embeds: [Abuser], ephemeral: true })

      } else if(userSchema.coins < 250) {
        const belowMinimum  = new EmbedBuilder()
          .setTitle("Cannot Gamble")
          .setDescription(
            `You must have above $250 to gamble`)

          .setColor("Red");

        await interaction.reply({ embeds: [belowMinimum], ephemeral: true });

        
      } else if (userSchema.coins < amount) {
        const AnotherOne = new EmbedBuilder()
          .setTitle("Cannot Gamble")
          .setDescription(
            `You cannot gamble anything more then what you have.`)

          .setColor("Red");

        await interaction.reply({ embeds: [AnotherOne], ephemeral: true });
          } else if (userSchema.coins  > amount){
        const OOF = new EmbedBuilder()
        .setTitle('Betting...')
        .setDescription(`Calculating bet...`)
        .setColor('Yellow')
      await interaction.reply({ embeds: [OOF] })

      await wait(2000);
      if (chance < 50) {
        userSchema.coins = userSchema.coins - amount;

        const OOF1 = new EmbedBuilder()
   
          .setTitle('Failed!')
          .setDescription(`
          > You lost $${amount}

          > Balance is now $${userSchema.coins}`)
          .setColor('Red')
        await interaction.editReply({ embeds: [OOF1] });
        userSchema.save();
      } else if (chance > 50) {
        userSchema.coins = userSchema.coins + amount;
      
        const winningBet1 = new EmbedBuilder()
        .setTitle('Winner!')
        .setDescription(`
        > You won $${amount}!
        
        > Balance is now $${userSchema.coins}`)

        .setColor('Green')
      await interaction.editReply({ embeds: [winningBet1] });
      userSchema.save();
      
      }
    }
    }
  }
