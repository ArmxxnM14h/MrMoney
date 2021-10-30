// Defining Random Stuff
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// All the command info will be listed here
module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Get your balance or another user's balance!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Get another user's balance!") 
        .setRequired(false),
        
),
cooldowns : new Set(),
cooldown : 5,
// Executing the interaction and defining nessessery stuff
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (user) {
      const bal = db.fetch(`${user}_wallet`) || 0;
      const bank = db.fetch(`${user}_bank`) || 0;
     const networth = bank + bal
      const balEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(`${user.tag}'s Balance'`)
        .setDescription(` :purse: Wallet: $${bal}

:bank: Bank: $${bank}
 
:money_mouth: Networth: $${networth}`)
        .setTimestamp();

// Reply to the entire interaction
      await interaction.reply({ embeds: [balEmbed] });
    } else {
      const bal = db.fetch(`${interaction.user.username}_wallet`) || 0;
     const bank = db.fetch(`${interaction.user.username}_bank`) || 0;
     const networth = bank + bal || 0;
// Entirely new embed
      const balEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Your Balance:")
        .setDescription(`:purse: Wallet: $${bal} 

:bank: Bank: $${bank}

:money_mouth: NetWorth: $${networth}`)
        .setTimestamp();
// Another reply and ending off the command
      await interaction.reply({ embeds: [balEmbed] });
    }
  },
};
