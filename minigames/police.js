const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const schema = require("../models/userschema.js");

async function policeGame(interaction, jobEarningData) {
    const res = await schema.findOne({ userID: interaction.user.id });

    try {
        // Customize the police mini-game logic here
        // ...

        // Example implementation:
        const crimeOptions = [
            "Robbery",
            "Burglary",
            "Assault"
        ];

        const selectedCrime = crimeOptions[Math.floor(Math.random() * crimeOptions.length)];

        // Create buttons for different police actions
        const arrestButton = new ButtonBuilder()
            .setCustomId('arrest')
            .setLabel('Arrest')
            .setStyle(ButtonStyle.Primary);

        const investigateButton = new ButtonBuilder()
            .setCustomId('investigate')
            .setLabel('Investigate')
            .setStyle(ButtonStyle.Primary);

        const ignoreButton = new ButtonBuilder()
            .setCustomId('ignore')
            .setLabel('Ignore')
            .setStyle(ButtonStyle.Primary);

        // Create an action row to hold the buttons
        const actionRow = new ActionRowBuilder()
            .addComponents(arrestButton, investigateButton, ignoreButton);

        // Create a new Embed instance describing the crime
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Police Mini-Game')
            .setDescription(`A crime has been reported: ${selectedCrime}`);

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
            let response;
            let moneyBuff = 0;
            let xpBuff = 0;
            const selectedCrime = crimeOptions[Math.floor(Math.random() * crimeOptions.length)];

            if (i.customId === 'arrest') {
                const isArrestSuccessful = Math.random() < 0.5;

                if (isArrestSuccessful) {
                    response = 'You successfully arrested the criminal and solved the crime!';
                    moneyBuff = res.totalJobLevel * 10;
                    xpBuff = Math.floor(res.totalJobLevel * 1.2);
                } else {
                    response = 'Unfortunately, the criminal managed to escape. Better luck next time!';
                }
            } else if (i.customId === 'investigate') {
                const isInvestigationSuccessful = Math.random() < 0.5;

                if (isInvestigationSuccessful) {
                    response = 'You investigated and managed to catch the criminal!';
                    moneyBuff = res.totalJobLevel * 10;
                    xpBuff = Math.floor(res.totalJobLevel * 1.2);
                } else {
                    response = 'Your investigation was unsuccessful.';
                }
            } else if (i.customId === 'ignore') {
                response = 'You decided to ignore the crime, and the criminal is still at large.';
            } else {
                response = 'You took no action.';
            }

            // Update user data
            res.coins += jobEarningData.moneyEarned + moneyBuff;
            res.workxp += jobEarningData.xpEarned + xpBuff;
            await res.save();

            // Create a new Embed instance for each interaction to avoid modifying previous embeds
            const updatedEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Police Mini-Game')
                .setDescription(`Crime: ${selectedCrime}\n\n${response}`)
                .addFields(
                    { name: 'Earnings', value: `Coins: ${jobEarningData.moneyEarned + moneyBuff}\nXP: ${jobEarningData.xpEarned + xpBuff}` }
                )
                .setColor('Green');

            // Check if the interaction is not deleted before replying
            if (!interaction.deleted) {
                interaction.editReply({ embeds: [updatedEmbed], components: [] });
            }
        });

        collector.on('end', async collected => {
            // If the user didn't select an action within the time limit, end the game
            if (collected.size === 0) {
                const timeoutEmbed = new EmbedBuilder()
                    .setDescription(`${selectedCrime}\n\nTime's up! The crime is still unsolved.`)
                    .setColor('Red');
                await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { policeGame };
