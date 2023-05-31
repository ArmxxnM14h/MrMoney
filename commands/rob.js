// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, EmbedBuilder } = require("discord.js");
const schema = require("../models/userschema.js");

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
    cooldown: {
      duration: 7, // Set the cooldown duration in seconds
    },
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (interaction.user.id === user.id) return interaction.reply("You cannot rob yourself!");

  const res = await schema.findOne({ userID: interaction.user.id })
  
      if (!res){
      const errEmbed = new EmbedBuilder()
      .setTitle('Error')
      .setDescription('An error has occured')
      .setFooter('Contact Support.')
      .setColor('Red')
      return interaction.reply({embeds: [errEmbed], ephemeral: true})
      }
      
    const res2 = await schema.findOne({ userID: user.id })
 

        if (!res2) {
          const errEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${user.username} hasn't used the bot yet!!`)
            .setTimestamp();

          // Reply to the entire interaction
          return interaction.reply({ embeds: [errEmbed] });
          
        } else if (res.passive === "Enabled"){

            const passiveEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription('You cannot rob with passive enabled.')
            .setColor('Red')
            return interaction.reply({embeds: [passiveEmbed]})

        } else if (res2.passive === "Enabled"){
         const passiveEmbed = new EmbedBuilder()
         .setTitle('Cannot rob user')
		 .setDescription('This user has passive enabled, you cannot rob them.')
 		return interaction.reply({embeds: [passiveEmbed]})

        } else if (res2.coins < 50) {
          const AnotherOne = new EmbedBuilder()
            .setTitle("Bruh..")
            .setDescription(
              `Why are you robbing users with a balance of less then 50??`
            )
            .setColor("Random");

          return await interaction.reply({ embeds: [AnotherOne], ephemeral: true });
        } else if (res.coins < 500) {
          const BrokeBoi = new EmbedBuilder()
            .setTitle('Your broke')
            .setDescription(`You need minimum $500 in your wallet to rob dude`)
            .setColor('Random')
          return await interaction.reply({ embeds: [BrokeBoi] });
        }

        const chance = Math.floor(Math.random() * Math.floor(100));

        if (chance < 50) {
          const ErrorEmbed = new EmbedBuilder()
            .setTitle("Yikes...")
            .setDescription(
              "You really failed the robbery and lost a total of $500")
            .setColor("Random");
          res.coins = res.coins - 500;
          res.save().catch(err => console.log(err));
          return await interaction.reply({ embeds: [ErrorEmbed] });

        } else if (chance >= 50) {
          const Ampro = Math.floor(Math.random() * Math.floor(res2.coins));
          const RobberySuccess = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Success!`)
            .setDescription(
              `You robbed a ${user.username} of $${Ampro}, you are so bad..`
            )
            .setTimestamp();
          res.coins = res.coins + Ampro;
          res.save().catch(err => console.log(err));
          res2.coins = res2.coins - Ampro;
          res2.save().catch(err => console.log(err));
          return await interaction.reply({ embeds: [RobberySuccess] });
        }
      }
    }
  
