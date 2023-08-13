const { EmbedBuilder } = require('discord.js');
const schema = require("../models/userschema.js");
const prompts = [
  "Write a short story about a mischievous cat and a curious dog.",
  "Describe a magical forest at sunset.",
  "Create a dialogue between two characters meeting for the first time.",
  "Write a poem about the stars and the night sky.",
  "Imagine you're a detective solving a mysterious case. Describe the scene of the crime."
];

function getRandomPrompt() {
  return prompts[Math.floor(Math.random() * prompts.length)];
}

async function writerGame(interaction, jobEarningData) {
    const res = await schema.findOne({ userID: interaction.user.id });
    try {
    const selectedPrompt = getRandomPrompt();

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Writer Mini-Game - Creative Writing')
      .setDescription('Get creative and respond to the prompt!')
      .addFields({ name :'Prompt', value: selectedPrompt },
      { name: 'Time Limit', value: 'You have 3 minutes to respond.'})
      .setTimestamp();

      if (interaction.replied) {
        await interaction.followUp({ embeds: [embed] });
          } else {
            await interaction.reply({ embeds: [embed] });
          }
    const filter = (response) => !response.author.bot; // Accept messages from non-bot users
    const collector = interaction.channel.createMessageCollector({ filter, time: 180000 });

    collector.on('collect', async (response) => {
    const userSentence = response.content.trim(); // Trim whitespace from user input
    if (userSentence.length > 0 && userSentence !== ".") {

      collector.stop();
      moneyBuff = res.totalJobLevel * 10;
      xpBuff = Math.floor(res.totalJobLevel * 1.2);
      const earned = jobEarningData.moneyEarned + moneyBuff;
      res.coins += earned
        res.workxp += jobEarningData.xpEarned + xpBuff;
        await res.save();

      const resultEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Creative Writing - Results')
        .addFields({ name: '> Prompt', value: selectedPrompt},
        { name: '> Your Response:', value: userSentence},
        { name: '> Earned:', value: `$${earned}` })
        .setTimestamp();
      await interaction.followUp({ embeds: [resultEmbed] });
    } else {         
        await interaction.followUp("Please write a valid sentence in response to the prompt.");
                }
    });
  
    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Time\'s up!')
          .setDescription('You didn\'t respond within the time limit.')
          .addField('Prompt', selectedPrompt)
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

module.exports = { writerGame };
