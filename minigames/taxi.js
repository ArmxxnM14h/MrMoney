const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const schema = require('../models/userschema')

// Function to generate a random customer name
function getRandomCustomerName() {
  const customerNames = ['John', 'Alice', 'Bob', 'Emma', 'Michael', 'Olivia', 'William', 'Sophia', 'James', 'Ava'];
  return customerNames[Math.floor(Math.random() * customerNames.length)];
}

// Function to generate a random destination
function getRandomDestination() {
  const destinations = ['Airport', 'Beach', 'Museum', 'Park', 'Shopping Mall', 'Restaurant', 'Movie Theater'];
  return destinations[Math.floor(Math.random() * destinations.length)];
}

// Taxi mini-game function
async function taxiGame(interaction, jobEarningData) {

    const res = await schema.findOne({ userID: interaction.user.id });

  try {
    // Generate a random customer and destination
    const customerName = getRandomCustomerName();
    const destination = getRandomDestination();

    const acceptButton = new ButtonBuilder()
      .setCustomId('accept')
      .setLabel('Accept Ride')
      .setStyle(ButtonStyle.Success);

    const declineButton = new ButtonBuilder()
      .setCustomId('decline')
      .setLabel('Decline Ride')
      .setStyle(ButtonStyle.Danger);

    // Create an action row to hold the accept and decline buttons
    const actionRow = new ActionRowBuilder()
      .addComponents(acceptButton, declineButton);

    const customerRequestEmbed = new EmbedBuilder()
      .setColor('#ff9900')
      .setTitle(`Taxi Ride Request`)
      .setDescription(`🚖 ${customerName} wants a taxi ride to ${destination}. Do you accept the ride?`);

      let msg
      if (interaction.replied) { 
          msg = await interaction.followUp({ embeds: [customerRequestEmbed], components: [actionRow], fetchReply: true}); }
       else {
          msg = await interaction.reply({ embeds: [customerRequestEmbed], components: [actionRow], fetchReply: true});
      }

    const response = await msg.awaitMessageComponent({
      filter: (i) => i.user.id === interaction.user.id,
      time: 60000,
    });

    if (response.customId === 'accept') {

        moneyBuff = res.totalJobLevel * 10;
        xpBuff = Math.floor(res.totalJobLevel * 1.2);
  
      const distance = Math.floor(Math.random() * 41) + 10;
      const fare = Math.round(distance * 0.40); 

      // Add the fare to the user's coins
      const coinsEarned = jobEarningData.moneyEarned + fare + moneyBuff;
      res.coins += coinsEarned;
      res.workxp += jobEarningData.xpEarned + xpBuff;
      res.save()
      // Create a response embed to show the ride details and reward
      const rideDetailsEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Taxi Ride Details')
        .setDescription(`🚖 You have completed the taxi ride for ${customerName} to ${destination}.`)
        .addFields(
          { name: 'Distance:', value: `${distance} miles`, inline: true },
          { name: 'Fare Earned:', value: `${fare} coins`, inline: true },
          { name: 'Total Coins Earned:', value: `${coinsEarned} coins` }
        );

      await msg.edit({ embeds: [rideDetailsEmbed], components: []});
    } else if (response.customId === 'decline') {

        const paid = jobEarningData.moneyEarned;

      // Create a response embed to show that the user declined the ride
      const declineEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Taxi Ride Request Declined')
        .setDescription(`🚖 You declined the taxi ride request from ${customerName} to ${destination}.

        You got paid $${paid} by your organisation`);

        res.coins += jobEarningData.coinsEarned;
        res.workxp += jobEarningData.xpEarned 
        res.save();

      await msg.edit({ embeds: [declineEmbed], components: []});
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { taxiGame };
