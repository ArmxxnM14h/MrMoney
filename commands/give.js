// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const schema = require("../models/userschema.js");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("give cash to people")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The person you want to give to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("choose the amount you want to give")
        .setRequired(true)
    ),
    cooldown: {
      duration: 60, // Set the cooldown duration in seconds
    },
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const given = interaction.options.getInteger("amount");
    const res = await schema.findOne({ userID: interaction.user.id })
 
      if (!res){
      const errEmbed = new EmbedBuilder()
      .setTitle('Error')
      .setDescription('An error has occured')
      .setFooter('Contact Support.')
      .setColor('Red')
       interaction.reply({embeds: [errEmbed], ephemeral: true})
      } 

      const bal = res.coins

      if (given <= 0) {
        const AnotherOne = new EmbedBuilder()
          .setTitle("Error")
          .setDescription(
            `You cannot give anything less then one!`
          )
          .setColor("Red");

        await interaction.reply({ embeds: [AnotherOne], ephemeral: true });

      } else if (user.id === interaction.user.id) {
        const embed = new EmbedBuilder()
          .setTitle('Transfer Failed')
          .setDescription('You cannot give cash to yourself')
          .setColor('Red')
        await interaction.reply({ embeds: [embed] })

      } else if (bal < given) {
        const ErrorEmbed = new EmbedBuilder()
          .setTitle("Error In Transaction")
          .setDescription(
            "Your balance is below that amount"
          )
          .setColor("Red");

        await interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
      } else if (bal >= given) {
        // Entirely new embed
        schema.findOne({
          userID: user.id
        }, async (err2, res2) => {
          if (err2) console.log(err);

          if (!res2) {
            const errEmbed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(`${user.username} hasn't used the bot yet!`)
              .setTimestamp();

            // Reply to the entire interaction
            return interaction.reply({ embeds: [errEmbed] });
          } else {
            res2.coins = res2.coins + given
            res2.save().catch((err) => console.log(err));
            res.coins = res.coins - given
            res.save().catch(err => console.log(err));
            const deposit = res.coins
            const balEmbed = new EmbedBuilder()
              .setColor("Green")
              .setTitle(`Donation Time!`)
              .setDescription(
                `> ${user.username} has recieved $${given}

                  > Given by ${interaction.user.username}

                  `
              )
              .setFooter({
                text: `Current balance: $${deposit}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setTimestamp();
            interaction.reply({ embeds: [balEmbed] });
          }
        });
      }
    }
  }

