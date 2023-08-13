const { EmbedBuilder } = require('discord.js');
const schema = require("../models/userschema.js");
const objects = [
  {
    name: 'Robot',
    description: 'This robot is missing a head and one of its arms. What components are needed to repair it?',
    image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fmedia.cnn.com%2Fapi%2Fv1%2Fimages%2Fstellar%2Fprod%2F130125162829-inmoov-15.jpg%3Fq%3Dw_770%2Ch_513%2Cx_0%2Cy_0%2Cc_fill%2Fh_618&tbnid=9YsreOVG9RbPoM&vet=12ahUKEwisgbGkwNmAAxXXnycCHeGdCu0QMygeegUIARCQAg..i&imgrefurl=https%3A%2F%2Fwww.cnn.com%2F2013%2F01%2F25%2Ftech%2Finnovation%2Finmoov-robot-3d-printing%2Findex.html&docid=FwBv9iv93u2M5M&w=928&h=618&q=robot%20without%20head%20and%20arm&ved=2ahUKEwisgbGkwNmAAxXXnycCHeGdCu0QMygeegUIARCQAg'
  },
  {
    name: 'Bridge',
    description: 'The bridge is missing a section in the middle. What materials are needed to complete the bridge?',
    image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1304694888%2Fphoto%2Fbroken-bridge-difficulty-and-challenge-concept.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DT4jHHWJzPJi48bmPq1PzPQjPkZniERksKbTOJGXgBpc%3D&tbnid=VSf37PDHHRBOHM&vet=12ahUKEwi754W8wNmAAxUzpCcCHaJXCoEQMygBegUIARD2AQ..i&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fbroken-bridge&docid=362qi0lbhzm6RM&w=612&h=320&q=broken%20bridge&ved=2ahUKEwi754W8wNmAAxUzpCcCHaJXCoEQMygBegUIARD2AQ'
  },
  // Add more objects with descriptions and images
];

function getCorrectComponents(object) {
    if (object.name === 'Robot') {
      return ['head', 'arm'];
    } else if (object.name === 'Bridge') {
      return ['steel beams', 'concrete'];
    }
    // Add more conditions for other objects
  }

  async function engineerGame(interaction, jobEarningData) {
    const res = await schema.findOne({userID: interaction.user.id})
    try {
      const selectedObject = objects[Math.floor(Math.random() * objects.length)];
  
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Engineer Mini-Game - Repair and Build')
        .setDescription(`You are tasked with repairing or completing the ${selectedObject.name}.\n\n${selectedObject.description}`)
        .setImage(selectedObject.image)
        .setFooter({ text: 'Reply with the components or actions needed to complete the task.'})
        .setTimestamp();
  
        if (interaction.replied) {
            await interaction.followUp({ embeds: [embed] });
              } else {
                await interaction.reply({ embeds: [embed] });
              }
                
      const correctComponents = getCorrectComponents(selectedObject);
  
      let tryCount = 0;
  
      const filter = (response) => response.author.id === interaction.user.id;
      const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });
  
      collector.on('collect', async (response) => {
        const userResponse = response.content.toLowerCase().trim();
        const userComponents = userResponse.split(/,\s+|,/); // Split response by commas and spaces
  
        if (correctComponents.every(comp => userComponents.includes(comp))) {
          collector.stop();

          moneyBuff = res.totalJobLevel * 10;
          xpBuff = Math.floor(res.totalJobLevel * 1.2);
          const earned = jobEarningData.moneyEarned + moneyBuff;
          res.coins += earned
            res.workxp += jobEarningData.xpEarned + xpBuff;
            await res.save();

          const resultEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('Task Completed!')
            .setDescription(`Congratulations! You've successfully repaired or completed the ${selectedObject.name}.
            > Earned: $${earned}`)
            .setImage(selectedObject.image)
            .setTimestamp();
  
          await interaction.followUp({ embeds: [resultEmbed] });
        } else {
          tryCount++;
  
          if (tryCount >= 3) {
            const correctComponentsString = correctComponents.join(', ');
            const tryAgainEmbed = new EmbedBuilder()
              .setColor('#ff0000')
              .setTitle('Try Again')
              .setDescription(`Your response is incorrect. Here are the correct components/actions: ${correctComponentsString}`)
              .setImage(selectedObject.image)
              .setTimestamp();
  
            await interaction.followUp({ embeds: [tryAgainEmbed] });
            collector.stop();
          } else {
            const tryAgainEmbed = new EmbedBuilder()
              .setColor('#ff0000')
              .setTitle('Try Again')
              .setDescription('Your response is incorrect. Keep trying!')
              .setImage(selectedObject.image)
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
            .setDescription(`You didn't complete the task in time.`)
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
  
  module.exports = { engineerGame };
  