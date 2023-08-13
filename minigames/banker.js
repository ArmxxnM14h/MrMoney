const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const schema = require('../models/userschema')
function getRandomCustomerName() {
  const customerNames = ['John', 'Alice', 'Bob', 'Emma', 'Michael', 'Olivia', 'William', 'Sophia', 'James', 'Ava'];
  return customerNames[Math.floor(Math.random() * customerNames.length)];
}

function getRandomTransactionType() {
  const transactionTypes = ['deposit', 'withdraw'];
  return transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
}

// Banker mini-game function
async function bankerGame(interaction, jobEarningData) {
    
    const res = await schema.findOne({ userID: interaction.user.id });


  try {
    // Generate a random customer and transaction
    const customerName = getRandomCustomerName();
    const transactionType = getRandomTransactionType();
    const amount = transactionType === 'deposit' ? Math.floor(Math.random() * 100) + 1 : Math.floor(Math.random() * 50) + 1;

    const depositButton = new ButtonBuilder()
      .setCustomId('deposit')
      .setLabel('Deposit')
      .setStyle(ButtonStyle.Success);

    const withdrawButton = new ButtonBuilder()
      .setCustomId('withdraw')
      .setLabel('Withdraw')
      .setStyle(ButtonStyle.Danger);

    // Create an action row to hold the transaction buttons
    const transactionActionRow = new ActionRowBuilder()
      .addComponents(depositButton, withdrawButton);

    const customerRequestEmbed = new EmbedBuilder()
      .setColor('#ff9900')
      .setTitle(`Customer: ${customerName}`)
      .setDescription(`How can I help you today? ${transactionType.charAt(0).toUpperCase()}${transactionType.slice(1)} amount: ${amount} coins`)
      .setFooter({ text: 'Choose wisely to earn rewards!'});

      let msg
      if (interaction.replied) { 
          msg = await interaction.followUp({ embeds: [customerRequestEmbed], components: [transactionActionRow], fetchReply: true}); }
       else {
          msg = await interaction.reply({ embeds: [customerRequestEmbed], components: [transactionActionRow], fetchReply: true});
      }
      
    const response = await msg.awaitMessageComponent({
      filter: (i) => i.user.id === interaction.user.id,
      time: 60000,
    });

    if (response.customId === 'deposit' && transactionType === 'deposit') {
      
      const totalCoinsDeposited = amount
      customerRequestEmbed.setDescription(`💰 Customer: ${customerName}, you have successfully deposited ${totalCoinsDeposited} coins.`)
      depositButton.setDisabled(true);
      withdrawButton.setDisabled(true);
      await msg.edit({ embeds: [customerRequestEmbed], components: [] });

      moneyBuff = res.totalJobLevel * 10;
      xpBuff = Math.floor(res.totalJobLevel * 1.2);

      const earned = jobEarningData.moneyEarned + moneyBuff;
      res.coins += jobEarningData.moneyEarned + moneyBuff;
      res.workxp += jobEarningData.xpEarned + xpBuff;
      await res.save();

      const rewardEmbed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Transaction Completed!')
      .setDescription(`Congratulations! You have earned ${earned} coins, including the bonus.`);
    
    await msg.reply({ embeds: [rewardEmbed] });


    } else if (response.customId === 'withdraw' && transactionType === 'withdraw') {
        depositButton.setDisabled(true);
      withdrawButton.setDisabled(true);
        customerRequestEmbed.setDescription(`💸 Customer: ${customerName}, you have withdrawn ${amount} coins.`);
        await msg.edit({ embeds: [customerRequestEmbed] , components: [] });

        moneyBuff = res.totalJobLevel * 10;
        xpBuff = Math.floor(res.totalJobLevel * 1.2);

        const earned = jobEarningData.moneyEarned + moneyBuff;
        res.coins += jobEarningData.moneyEarned + moneyBuff;
        res.workxp += jobEarningData.xpEarned + xpBuff;
        await res.save();

        const rewardEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Transaction Completed!')
        .setDescription(`Congratulations! You have earned ${earned} coins, including the bonus.`);
      
      await msg.reply({ embeds: [rewardEmbed] });

    } else {
        depositButton.setDisabled(true);
        withdrawButton.setDisabled(true);

        customerRequestEmbed.setDescription(`❌ Customer: ${customerName}, you did not fulfill the request correctly. Your bonus is has been removed!`);
        customerRequestEmbed.setColor('Red')
        await msg.edit({ embeds: [customerRequestEmbed] , components: [] });

        const earned = jobEarningData.moneyEarned; 
        res.coins += jobEarningData.moneyEarned;
        res.workxp += jobEarningData.xpEarned;
        res.save();

      const rewardEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Transaction failed!')
        .setDescription(`You have earned ${earned} coins.`);
      
      await msg.reply({ embeds: [rewardEmbed] });

    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { bankerGame };
