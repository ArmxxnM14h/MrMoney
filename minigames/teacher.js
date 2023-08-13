const { EmbedBuilder } = require('discord.js');

const words = ['english', 'maths', 'science', 'biology', 'chemistry', 'physics', 'history', 'geography', 'art', 'software', 'graphics'];
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

async function teacherGame(interaction, jobEarningData) {
  const schema = require('../models/userschema')
  const res = await schema.findOne({ userID: interaction.user.id });

  try {
    const selectedWord = getRandomWord();

    const scrambledWord = selectedWord.split('').sort(() => 0.5 - Math.random()).join('');

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Teacher Mini-Game - Guess the Word')
      .setDescription('Unscramble the word and guess the correct word!')
      .addFields({ name: 'Scrambled Word', value: scrambledWord })
      .setTimestamp();

      if (interaction.replied) {
        await interaction.followUp({ embeds: [embed] });
          } else {
            await interaction.reply({ embeds: [embed] });
          }
          

    const filter = (response) => !response.author.bot; // Accept messages from non-bot users
const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

    collector.on('collect', async (response) => {
      const userGuess = response.content.toLowerCase().trim();
      if (userGuess === selectedWord) {
        collector.stop(); // Stop the collector immediately upon correct answer

        moneyBuff = res.totalJobLevel * 10;
        xpBuff = Math.floor(res.totalJobLevel * 1.2);

        const mnyearned = jobEarningData.moneyEarned + moneyBuff;
        const xpearned = jobEarningData.xpEarned + xpBuff;
        res.coins += jobEarningData.moneyEarned + moneyBuff;
        res.workxp += jobEarningData.xpEarned + xpBuff;
        await res.save();

        const resultEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('Congratulations!')
          .setDescription(`You've guessed the correct word: ${selectedWord}!
          
          > Cash Earned: $${mnyearned}
          > XP Earned: ${xpearned}`)
          .setTimestamp();

        await interaction.followUp({ embeds: [resultEmbed] });
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Time\'s up!')
          .setDescription(`The correct word was: ${selectedWord}`)
          .setTimestamp();

        if (!collected.size) { // Only send the timeout message if there were no correct guesses
          await interaction.followUp({ embeds: [timeoutEmbed] });
        }
      }
    });

  } catch (error) {
    console.error(error);
  }
}

module.exports = { teacherGame };
