const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const schema = require("../models/userschema.js");
async function doctorGame(interaction, jobEarningData) {
  const res = await schema.findOne({ userID: interaction.user.id });

    try {
  const patientNeeds = [
    "Virus medicine: Red bottle",
    "Antibiotic: Blue bottle",
    "Paracetamol: Green bottle"
  ];

  // Choose a random patient need from the list
  const patientNeed = patientNeeds[Math.floor(Math.random() * patientNeeds.length)];

  // Create a message embed describing the patient need
  const embed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('Doctor Mini-Game')
    .setDescription(`A patient comes in and needs:\n\n${patientNeed}`);

  // Create buttons for different medicine options
  const blueButton = new ButtonBuilder()
    .setCustomId('blue_medicine')
    .setLabel('Blue Bottle')
    .setStyle(ButtonStyle.Primary);

  const redButton = new ButtonBuilder()
    .setCustomId('red_medicine')
    .setLabel('Red Bottle')
    .setStyle(ButtonStyle.Primary);

  const greenButton = new ButtonBuilder()
    .setCustomId('green_medicine')
    .setLabel('Green Bottle')
    .setStyle(ButtonStyle.Primary);

  // Create an action row to hold the buttons
  const actionRow = new ActionRowBuilder()
    .addComponents(blueButton, redButton, greenButton);

  // Send the embed and buttons to the user
  let msg
        if (interaction.replied) { 
            msg = await interaction.followUp({ embeds: [embed], components: [actionRow], fetchReply: true}); }
         else {
            msg = await interaction.reply({ embeds: [embed], components: [actionRow], fetchReply: true});
        }

  // Wait for the user to interact with the buttons
  const filter = i => i.user.id === interaction.user.id;
  const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

  collector.on('collect', async i => {
    
    moneyBuff = res.totalJobLevel * 10;
      xpBuff = Math.floor(res.totalJobLevel * 1.2);
      
      res.coins += jobEarningData.moneyEarned + moneyBuff;
      res.workxp += jobEarningData.xpEarned + xpBuff;
    // Check if the user selected the correct medicine based on the patient need
    let response;
    if (
      (patientNeed.includes('Virus medicine') && i.customId === 'red_medicine') ||
      (patientNeed.includes('Antibiotic') && i.customId === 'blue_medicine') ||
      (patientNeed.includes('Paracetamol') && i.customId === 'green_medicine')
    ) {
      response = `You gave the correct medicine! The patient feels better.
      
      Earned: ${jobEarningData.moneyEarned + moneyBuff}`

    } else {
      response = `Oops! That was not the right medicine. The patient still needs treatment.
      
      > Earned: ${res.jobEarningData.moneyEarned}`
      res.coins += jobEarningData.moneyEarned;
      res.workxp += jobEarningData.xpEarned;

    }

    // Update the embed with the user's choice
    embed.setDescription(`${patientNeed}\n\n${response}`);
    interaction.editReply({ embeds: [embed], components: [] });
  });

  collector.on('end', async collected => {
    // If the user didn't select a medicine within the time limit, end the game
    if (collected.size === 0) {
      embed.setDescription(`${patientNeed}\n\nTime's up! The patient couldn't wait any longer.`);
      await interaction.editReply({ embeds: [embed], components: [] });
    }
  });
} catch (error) {
    console.log(error)
 }
}

module.exports = { doctorGame };
