// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const schema = require("../models/userschema.js");
// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("passive_disable")
    .setDescription("disable passive"),
  cooldowns: new Set(),
  cooldown: 240000,
  // Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    schema.findOne({
        userID: interaction.user.id
    }, (err, res) => {
        if (err) console.log(err);

        if (!res) {
            return interaction.reply({ content: "First time users need to use the bal command to start" })
        }
    if(res.passive == "Disabled") {
        return interaction.reply({ content: "You already have passive disabled!" })
    } else {

        res.passive = "Disabled"
        res.save().catch(err => console.log(err));

    const passiveEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Passive Disabled`)
      .setDescription(`You have disabled passive!`)
      .setTimestamp();
    interaction.reply({ embeds: [passiveEmbed] });
    
    }
  });
    },
};