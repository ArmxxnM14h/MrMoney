const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const schema = require('../models/userschema')
// Function to generate a random transaction
function getRandomTransaction() {
  const transactionTypes = ['Income', 'Expense'];
  const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];

  const amount = Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000 coins

  return { type: transactionType, amount: amount };
}

// Accountant mini-game function
async function accountantGame(interaction, jobEarningData) {

  try {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Accountant Mini-Game')
      .setDescription('Help the virtual company manage their finances and calculate the budget.')
      .addFields({ name:'Instructions', value:'Click all the "Record Transaction" buttons to record random incomes or expenses.'})
      .setTimestamp();

    const startButton = new ButtonBuilder()
      .setCustomId('start')
      .setLabel('Record Transaction')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(startButton);

      let msg
      if (interaction.replied) { 
          msg = await interaction.followUp({ embeds: [embed], components: [row], fetchReply: true}); }
       else {
          msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true});
      }

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 }); // 60 seconds for the mini-game

    let transactions = [];
    let totalIncome = 0;
    let totalExpense = 0;

    collector.on('collect', async (i) => {
      if (i.customId === 'start') {
        const transaction = getRandomTransaction();
        transactions.push(transaction);

        const transactionEmbed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('Transaction Recorded')
          .addFields(
            { name: 'Transaction Type', value: transaction.type },
            { name: 'Amount', value:`${transaction.amount} coins` }
          )
          .setTimestamp();

        if (transaction.type === 'Income') {
          totalIncome += transaction.amount;
        } else if (transaction.type === 'Expense') {
          totalExpense += transaction.amount;
        }

        row.components = [startButton]; // Ensure that the row contains the start button after each interaction update
        await i.update({ embeds: [transactionEmbed], components: [row] });

        if (transactions.length === 5) {
          collector.stop(); // Stop the collector after 5 transactions
          const bonus = calculateBonus(transactions);
          totalIncome += bonus;
          sendResultEmbed(interaction, totalIncome, totalExpense, jobEarningData);
        }
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        sendResultEmbed(interaction, totalIncome, totalExpense);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

// Function to calculate the bonus based on the transactions recorded
function calculateBonus(transactions) {
  let bonus = 0;
  for (const transaction of transactions) {
    if (transaction.type === 'Income') {
      bonus += transaction.amount * 0.1; // 10% bonus for each recorded income
    }
  }
  return bonus;
}

// Function to send the final result embed
async function sendResultEmbed(interaction, totalIncome, totalExpense) {
    const res = await schema.findOne({ userID: interaction.user.id });
  const budget = Math.round(totalIncome - totalExpense);

  const resultEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Accountant Mini-Game Result')
    .addFields(
      { name: 'Total Income', value:`${totalIncome} coins`},
      { name: 'Total Expense', value:`${totalExpense} coins`},
      { name: 'Budget',  value:`${budget} coins`}
    )
    .setTimestamp();

  await interaction.followUp({ embeds: [resultEmbed], components: [] });

  moneyBuff = res.totalJobLevel * 10;
  xpBuff = Math.floor(res.totalJobLevel * 1.2);

  const coins = jobEarningData.moneyEarned + moneyBuff;

  res.coins += jobEarningData.moneyEarned + moneyBuff + bonus;
  res.workxp += jobEarningData.xpEarned + xpBuff;
  await res.save();

    const embed = new EmbedBuilder()
    .setTitle('Success!')
    .setDescription(`GG! You managed to calculate budget.
    
   > Coins Earned: ${coins}
    `)
    .setColor('Green')
        
  msg.reply({embeds: [embed]})
}

module.exports = { accountantGame };
