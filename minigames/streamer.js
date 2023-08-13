const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const schema = require('../models/userschema.js');

async function streamerGame(interaction, jobEarningData) {
    const res = await schema.findOne({ userID: interaction.user.id });

    try {
        // Customize the streamer mini-game logic here
        // For example, you can have an array of video game titles
        const videoGames = [
            "Fortnite",
            "Minecraft",
            "Among Us",
            "Valorant",
            "League of Legends",
            "Apex Legends",
            "Call of Duty",
            "Overwatch",
            "FIFA",
            "Genshin Impact",
            "Animal Crossing",
            "The Sims",
            "Rocket League",
            // Add more video game titles here
        ];

        // Pick a random video game title for the user to stream
        const randomGame = videoGames[Math.floor(Math.random() * videoGames.length)];

        // Create buttons for different actions
        const streamButton = new ButtonBuilder()
            .setCustomId('stream')
            .setLabel('Start Streaming')
            .setStyle(ButtonStyle.Primary);

        const stopButton = new ButtonBuilder()
            .setCustomId('stop')
            .setLabel('Stop Streaming')
            .setStyle(ButtonStyle.Danger);

        // Create an action row to hold the buttons
        const actionRow = new ActionRowBuilder()
            .addComponents(streamButton, stopButton);

        // Create a new Embed instance to present the game
        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setTitle('Streamer Mini-Game')
            .setDescription(`Start streaming ${randomGame} and entertain your audience!`)
            .addFields({ name: 'Tips:', value: 'Make sure to engage with your viewers and have fun!'})

        let msg
        if (interaction.replied) { 
            msg = await interaction.followUp({ embeds: [embed], components: [actionRow], fetchReply: true}); }
         else {
            msg = await interaction.reply({ embeds: [embed], components: [actionRow], fetchReply: true});
        }
        
const filter = i => i.user.id === interaction.user.id;
const collector = msg.createMessageComponentCollector({ filter, time: 120000 }); // Allow 60 seconds for the mini-game
let totalDonationAmount = 0;
let isStreaming = false;


collector.on('collect', async i => {
    if (i.customId === 'stream') {
        if (!isStreaming) {
            // User clicked the "Start Streaming" button
            isStreaming = true;

            // Add custom logic here for the streamer mini-game
            // For example, you can increment streamer points or coins

            // Check if the interaction is not deleted before replying
            
                msg.reply({ content: `You are now live streaming ${randomGame}! Enjoy your stream!`, ephemeral: true })

            const viewerComments = [
                "Wow, you're so skilled at this game!",
                "I'm loving your gameplay!",
                "Your streams always make my day better!",
                "You're a natural entertainer!",
                "This stream is so much fun!",
                "Keep up the great work!",
                "You have such a friendly community!",
                "I'm learning a lot from watching you play!",
                "Your energy is contagious!",
                "You deserve more viewers! Spread the word!",
                "Your gameplay is so smooth!",
                "I'm always excited for your streams!",
                "You're the best streamer out there!",
                "I never miss a stream!",
                "Your reactions are priceless!",
                "You always make me laugh!",
                "Your skills are on another level!",
                "I'm inspired by your dedication!",
                "I can't stop watching!",
                "Your stream is my happy place!",
                "You make this game look easy!",
                "You've got some serious talent!",
                "I'm addicted to your content!",
                "Your community is so friendly and welcoming!",
                "You're the reason I started playing this game!",
                // Add more viewer comments here
            ];

            const totalDurationInMinutes = 1;
            const commentIntervalInSeconds = 5;
            const donationChance = 0.1;

            const streamInterval = setInterval(() => {
                const randomComment = viewerComments[Math.floor(Math.random() * viewerComments.length)];

            interaction.followUp({ content: randomComment, ephemeral: true });
                // Random chance for getting a donation
                if (Math.random() < donationChance) {
                    const donationAmount = Math.floor(Math.random() * 20) + 1; // Random amount between 1 and 25
                    // Update user data with the donation amount
                    totalDonationAmount += donationAmount;
                    res.coins += donationAmount;
                    res.save();

                    // Create a new Embed instance to announce the donation
                    const donationEmbed = new EmbedBuilder()
                        .setColor('Purple')
                        .setTitle('Donation Received')
                        .setDescription(`You received a donation of ${donationAmount} coins from a generous virtual viewer!`);

                    // Check if the interaction is not deleted before sending the donation message
                    msg.reply({ embeds: [donationEmbed], ephemeral: true });
                }

                // Simulate the virtual viewers' reactions based on whether the user comments back or not
               
            }, commentIntervalInSeconds * 1000);

            // Stop the stream simulation after the stream duration
            setTimeout(() => {
                clearInterval(streamInterval);

                // After the stream ends, ask the user to click the "Stop Streaming" button
                const endStreamEmbed = new EmbedBuilder()
                    .setColor('Purple')
                    .setTitle('Stream Ended')
                    .setDescription(`Your ${randomGame} stream has ended. Click the "Stop Streaming" button to see your earnings!`);

                // Check if the interaction is not deleted before sending the end stream message
                const actionRow = new ActionRowBuilder().addComponents(streamButton, stopButton); // Update the action row with the new button status

                    msg.reply({ embeds: [endStreamEmbed] });

                    streamButton.setDisabled(true);
                    msg.edit({ embeds: [endStreamEmbed], components: [actionRow] })
            }, totalDurationInMinutes * 60 * 1000); // Convert total duration to milliseconds
        } else {

            // User is already streaming and cannot click the "Start Streaming" button again
            msg.reply({ content: "You are already streaming. You cannot start another stream.", ephemeral: true });
        }
    } else if (i.customId === 'stop') {
        if (isStreaming) {
            isStreaming = false;


            moneyBuff = res.totalJobLevel * 10;
            xpBuff = Math.floor(res.totalJobLevel * 1.2);

            const coinsEarned = jobEarningData.moneyEarned + moneyBuff 

            // Update user data
            res.coins += coinsEarned;
            res.workxp += jobEarningData.xpEarned + xpBuff;
            await res.save();

            const allcoins = coinsEarned + totalDonationAmount
            // Create a new Embed instance to show the result
            const resultEmbed = new EmbedBuilder()
                .setColor('Purple')
                .setTitle('Streamer Mini-Game Result')
                .setDescription(`You earned ${allcoins} coins from your stream!`);

            // Check if the interaction is not deleted before replying
            if (!interaction.deleted) {
                 msg.reply({ embeds: [resultEmbed] });
                collector.stop(); // Stop the collector after sending the result embed
            }
        } else {
            // User clicked the "Stop Streaming" button without starting a stream
            msg.reply({ content: "You are not currently streaming, so you cannot stop the stream.", ephemeral: true });
        }
    }
});


        collector.on('end', async collected => {
            // If the user didn't take any action within the time limit, end the game
            if (collected.size === 0) {
                const timeoutEmbed = new EmbedBuilder()
                    .setDescription('Time\'s up! Your stream has ended.')
                    .setColor('Red');
                await msg.edit({ embeds: [timeoutEmbed], components: [] });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { streamerGame };
