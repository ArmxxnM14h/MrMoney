const { EmbedBuilder } = require('discord.js');

const dishes = [
  { name: 'Spaghetti Carbonara', ingredients: ['pasta', 'egg', 'bacon', 'parmesan', 'pepper'] },
  { name: 'Chicken Stir-Fry', ingredients: ['chicken', 'vegetables', 'soy sauce', 'rice'] },
  { name: 'Caesar Salad', ingredients: ['lettuce', 'croutons', 'parmesan', 'caesar dressing'] },
  { name: 'Chocolate Brownie', ingredients: ['flour', 'sugar', 'cocoa powder', 'eggs', 'chocolate'] },
];

function getRandomDish() {
  return dishes[Math.floor(Math.random() * dishes.length)];
}

async function chefGame(interaction) {
  try {
    const selectedDish = getRandomDish();

    const ingredientsString = selectedDish.ingredients
      .map((ingredient, index) => `${index + 1}. ${ingredient}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Chef Mini-Game - Dish Assembly')
      .setDescription(`Assemble the dish: **${selectedDish.name}**\n\nHere are the ingredients:\n${ingredientsString}`)
      .setFooter({ text:'Reply with the numbers of the ingredients in the correct order.'})
      .setTimestamp();

      if (interaction.replied) {
        await interaction.followUp({ embeds: [embed] });
          } else {
            await interaction.reply({ embeds: [embed] });
          }
    let tryCount = 0;
    let correctNumbers = selectedDish.ingredients.map((_, index) => index + 1);

    const filter = (response) => response.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

    collector.on('collect', async (response) => {
      const userNumbers = response.content.split(/\s+/).map(num => parseInt(num));

      if (userNumbers.length === correctNumbers.length && userNumbers.every((num, index) => num === correctNumbers[index])) {
        collector.stop();

        const resultEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('Dish Assembled!')
          .setDescription(`You've successfully assembled the dish: **${selectedDish.name}**`)
          .setTimestamp();

        await interaction.followUp({ embeds: [resultEmbed] });
      } else {
        tryCount++;

        if (tryCount >= 3) {
          const correctNumbersString = correctNumbers.join(', ');
          const tryAgainEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Try Again')
            .setDescription(`Your ingredient order is incorrect. Here are the correct numbers: ${correctNumbersString}`)
            .setTimestamp();

          await interaction.followUp({ embeds: [tryAgainEmbed] });

          // Provide the correct answer
          const correctAnswerEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Correct Answer')
            .setDescription(`The correct ingredient order for ${selectedDish.name} is: ${correctNumbersString}`)
            .setTimestamp();

          await interaction.followUp({ embeds: [correctAnswerEmbed] });

          collector.stop();
        } else {
          const tryAgainEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Try Again')
            .setDescription('Your ingredient numbers are incorrect. Make sure you list the numbers in the correct order.')
            .setTimestamp();

          await interaction.followUp({ embeds: [tryAgainEmbed] });
        }
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Time\'s up!')
          .setDescription(`You didn't assemble the dish in time.`)
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

module.exports = { chefGame };
