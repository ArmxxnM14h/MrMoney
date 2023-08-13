const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const schema = require("../models/userschema.js");

async function cashierGame(interaction, jobEarningData) {
    const res = await schema.findOne({ userID: interaction.user.id });

    try {
        // Customize the cashier mini-game logic here
        // For example, you can have an array of items and their prices
        const items = [
            { name: "Apple", price: 2 },
            { name: "Banana", price: 1.5 },
            { name: "Orange", price: 3 },
            { name: "Lemon", price: 2.5 },
            { name: "Mango", price: 4 },
            { name: "Strawberry", price: 2.75 },
            { name: "Grapes", price: 3.25 },
            { name: "Watermelon", price: 5 },
            { name: "Pineapple", price: 3.5 },
            { name: "Cherry", price: 2.25 },
            { name: "Peach", price: 3.75 },
            { name: "Pear", price: 2.25 },
            { name: "Kiwi", price: 2.75 },
            // Add more items here
        ];
        
        const numberOfItemsToScan = Math.floor(Math.random() * 3) + 2;

        // Shuffle the items array to present them randomly to the player
        const shuffledItems = items.sort(() => Math.random() - 0.5).slice(0, numberOfItemsToScan);

        // Calculate the total bill based on the shuffled items
        let totalBill = shuffledItems.reduce((sum, item) => sum + item.price, 0);


        // Create buttons for different actions
        const scanButton = new ButtonBuilder()
            .setCustomId('scan')
            .setLabel('Scan Next Item')
            .setStyle(ButtonStyle.Primary);

        const calculateButton = new ButtonBuilder()
            .setCustomId('calculate')
            .setLabel('Calculate Total')
            .setStyle(ButtonStyle.Primary);

        const stopButton = new ButtonBuilder()
            .setCustomId('stop')
            .setLabel('Stop Scanning')
            .setStyle(ButtonStyle.Danger);

        // Create an action row to hold the buttons
        const actionRow = new ActionRowBuilder()
            .addComponents(scanButton, calculateButton, stopButton);

        // Create a new Embed instance to present the game
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Cashier Mini-Game')
            .setDescription('Scan the items and calculate the total bill!')
            .addFields({ name: 'Items to Scan:', value: shuffledItems.map(item => item.name).join(', ')}, 
            { name: 'Total Bill:', value: `${totalBill} coins` })
        // Send the embed and buttons to the user
        let msg
        if (interaction.replied) { 
            msg = await interaction.followUp({ embeds: [embed], components: [actionRow], fetchReply: true}); }
         else {
            msg = await interaction.reply({ embeds: [embed], components: [actionRow], fetchReply: true});
        }
        // Keep track of scanned items and the calculated total
        let scannedItems = [];
        let calculatedTotal = 0;

        // Wait for the user to interact with the buttons
        const filter = i => i.user.id === interaction.user.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 100000 });
        
        collector.on('collect', async i => {
            if (i.customId === 'scan') {
                // User clicked the "Scan Next Item" button
                const currentItem = shuffledItems[scannedItems.length];
                scannedItems.push(currentItem);

                if (scannedItems.length === numberOfItemsToScan) {
                    // Disable the "Scan Next Item" button
                    scanButton.setDisabled(true);
                }
                // Create a new Embed instance to update the game
                const updatedEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('Cashier Mini-Game')
                    .setDescription('Scan the items and calculate the total bill!')
                    .addFields({ name: 'Items to Scan:', value: shuffledItems.map(item => item.name).join(', ')}, 
                    { name: 'Total Bill:', value: `${totalBill} coins` },
                    { name: 'Scanned Items:', value: scannedItems.map(item => item.name).join(', ')})
                    
                // Check if the interaction is not deleted before replying
                if (!interaction.deleted) {
                    i.update({ embeds: [updatedEmbed], components: [actionRow] });
                }
            } else if (i.customId === 'calculate') {
                if (scannedItems.length < numberOfItemsToScan) {
                    // User needs to scan all items before calculating the total
                    i.reply({ content: "Please scan all items before calculating the total!", ephemeral: true });
                } else {
                calculatedTotal = scannedItems.reduce((sum, item) => sum + item.price, 0);

                // Create a new Embed instance to update the game with the calculated total
                const updatedEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('Cashier Mini-Game')
                    .setDescription('Scan the items and calculate the total bill!')
                    .addFields({ name: 'Items to Scan:', value: shuffledItems.map(item => item.name).join(', ')}, 
                    { name: 'Total Bill:', value: `${totalBill} coins` },
                    { name: 'Scanned Items:', value: scannedItems.map(item => item.name).join(', ')}, 
                    { name: 'Calculated Total:', value: `${calculatedTotal} coins`})
                   
                // Check if the interaction is not deleted before replying
                if (!interaction.deleted) {
                    i.update({ embeds: [updatedEmbed], components: [actionRow] });
                }
                    }
            } else if (i.customId === 'stop') {
                
                if (scannedItems.length < numberOfItemsToScan) {
                  
                    i.reply({ content: "Please scan all items before ending the minigame!", ephemeral: true });
                } else {

                
                moneyBuff = res.totalJobLevel * 10;
                xpBuff = Math.floor(res.totalJobLevel * 1.2);
                const hehe = Math.ceil((calculatedTotal / totalBill))
                const coinsEarned = jobEarningData.moneyEarned + moneyBuff + hehe

                // Update user data
                res.coins += jobEarningData.moneyEarned + moneyBuff + hehe
                res.workxp += jobEarningData.xpEarned + xpBuff
                await res.save();

                // Create a new Embed instance to show the result
                const resultEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('Cashier Mini-Game Result')
                    .setDescription(`You earned ${coinsEarned} coins!`);
               
                    i.reply({ embeds: [resultEmbed] });
                
                collector.stop();
              }
            }
        });

        collector.on('end', async collected => {
            // If the user didn't take any action within the time limit, end the game
            if (collected.size === 0) {
                const timeoutEmbed = new EmbedBuilder()
                    .setDescription('Time\'s up! You didn\'t complete the game.')
                    .setColor('Red');
                await interaction.update({ embeds: [timeoutEmbed], components: [] });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { cashierGame };
