const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("roast")
    .setDescription("Roast yourself or another user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Get the user you wan roast") 
        .setRequired(false),
),
cooldowns : new Set(),
cooldown : 5,
// Executing the interaction and defining nessessery stuff
  async execute(interaction) {
 const user = interaction.options.getUser("user");
const writtenRoasts = ["Your so dumb that even a apple is smarter then you",
"Your breath stinks so bad you can smell it from a mile away",
"Bro, you look like shrek from another dimension",
"Your so fat that the ground around you breaks till you reach the core of earth",
"Lmao you can be used as a shelter, thats how big you are",
];
var roasts = writtenRoasts[Math.floor(Math.random() * writtenRoasts.length)]
if(user){
const embed = new MessageEmbed()
.setTitle('Roasted :fire:')
.setDescription(`Lmao, ${user.username} got roasted by ${interaction.user.username}

**Roast:** ${roasts}`)
.setColor('RANDOM')
.setTimestamp()
await interaction.reply({embeds: [embed]})
} else {
const embed = new MessageEmbed()
.setTitle('Roasted :fire:')
.setDescription(`Lmao, ${interaction.user.username} got roasted

**Roast:** ${roasts}`)
.setColor('RANDOM')
.setTimestamp()
await interaction.reply({embeds: [embed]})
}
 }
   }