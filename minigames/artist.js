const { EmbedBuilder } = require('discord.js');
const schema = require('../models/userschema')

const colors = [
  { name: 'Red', rgb: [255, 0, 0] },
  { name: 'Green', rgb: [0, 255, 0] },
  { name: 'Blue', rgb: [0, 0, 255] },
  { name: 'Yellow', rgb: [255, 255, 0] },
  // Add more colors
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

async function artistGame(interaction, jobEarningData) {
    const res = await schema.findOne({ userID: interaction.user.id });

  try {
    const selectedColor = getRandomColor();

    const embed = new EmbedBuilder()
      .setColor(`#${selectedColor.rgb.map(val => val.toString(16).padStart(2, '0')).join('')}`)
      .setTitle('Artist Mini-Game - Identify the Color')
      .setDescription(`Identify the color based on its RGB values.\n\nRGB: ${selectedColor.rgb.join(', ')}`)
      .setFooter({ text: 'Reply with the name of the color.'})
      .setTimestamp();
      if (interaction.replied) {
    await interaction.followUp({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed] });
      }
    const filter = (response) => response.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

    collector.on('collect', async (response) => {
      const userResponse = response.content.toLowerCase().trim();
      if (userResponse === selectedColor.name.toLowerCase()) {
        collector.stop();

        moneyBuff = res.totalJobLevel * 10;
        xpBuff = Math.floor(res.totalJobLevel * 1.2);
        const earned = jobEarningData.moneyEarned + moneyBuff;
        res.coins += earned
          res.workxp += jobEarningData.xpEarned + xpBuff;
          await res.save();

        const resultEmbed = new EmbedBuilder()
          .setColor(`#${selectedColor.rgb.map(val => val.toString(16).padStart(2, '0')).join('')}`)
          .setTitle('Correct!')
          .setDescription(`You've identified the color correctly: **${selectedColor.name}**

          > Earned: $${earned}`)
          .setTimestamp();

        await interaction.followUp({ embeds: [resultEmbed] });
      } else {
        const tryAgainEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Try Again')
          .setDescription('Your response is incorrect. Keep trying!')
          .setTimestamp();

        await interaction.followUp({ embeds: [tryAgainEmbed] });
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Time\'s up!')
          .setDescription(`You didn't identify the color in time.`)
          .setTimestamp();

        if (!collected.size) {
          await interaction.followUp({ embeds: [timeoutEmbed] });
        }
      }
    });

  } catch (error) {
    console.error(error);
  }
}

module.exports = { artistGame };
