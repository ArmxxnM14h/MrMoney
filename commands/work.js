const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const schema = require("../models/userschema.js");
const { doctorGame } = require('../minigames/doctor.js');
const { policeGame } = require('../minigames/police.js');
const { cashierGame } = require('../minigames/cashier.js');
const { streamerGame } = require('../minigames/streamer.js');
const { bankerGame } = require('../minigames/banker.js');
const { taxiGame } = require('../minigames/taxi.js');
const { accountantGame } = require('../minigames/accountant.js');
const { teacherGame } = require('../minigames/teacher.js');
const { writerGame } = require('../minigames/writer.js');
const { chefGame } = require('../minigames/chef.js');
const { engineerGame } = require('../minigames/engineer.js');
const { artistGame } = require('../minigames/artist.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to earn more money!'),
    cooldown: {
        duration: 3600, // Set the cooldown duration in seconds
    },

    async execute(interaction) {
        const res = await schema.findOne({ userID: interaction.user.id });

        if (!res) {
            const errEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error has occurred')
                .setFooter('Contact Support.')
                .setColor('Red');
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }

        if (res.job === "unemployed") {
            const noJobEmbed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("No Job")
                .setDescription("You don't have a job yet! Use the `/job set` command to set your job.");
            return interaction.reply({ embeds: [noJobEmbed], ephemeral: true });
        }

            const jobEarnings = {
            cashier: { moneyEarned: 80, xpEarned: 20 },
            banker: { moneyEarned: 125, xpEarned: 43 },
            accountant: { moneyEarned: 140, xpEarned: 52 },
            streamer: { moneyEarned: 80, xpEarned: 20 },
            taxi: { moneyEarned: 92, xpEarned: 31 },
            police: { moneyEarned: 96, xpEarned: 25 },
            doctor: { moneyEarned: 525, xpEarned: 160 },
            chef: { moneyEarned: 265, xpEarned: 100 },
            engineer: { moneyEarned: 284, xpEarned: 110 },
            artist: { moneyEarned: 334, xpEarned: 125 },
            teacher: { moneyEarned: 168, xpEarned: 85 },
            writer: { moneyEarned: 183, xpEarned: 90 }
            };
            
         const jobEarningData = jobEarnings[res.job];
        const moneyEarned = jobEarningData.moneyEarned;
        const xpEarned = jobEarningData.xpEarned;


        if (!res.jobLevels) {
            res.jobLevels = {};
        }

        res.coins += jobEarningData.moneyEarned 
            res.workxp += jobEarningData.xpEarned 
        // Define the base XP requirement and the percentage increase
        const baseXpRequirement = 100;
        const xpRequirementIncreasePercentage = 0.03; // 3%

        // Update the job level based on work XP
        const currentJobLevel = res.totalJobLevel || 0;
        const newJobLevel = Math.floor(res.workxp / baseXpRequirement);

        // Check if the user has ranked up and the milestone message has not been sent before
        if (newJobLevel > currentJobLevel) {
            res.totalJobLevel = newJobLevel;

            // Calculate the new XP requirement for the next level based on the percentage increase
            const xpRequirement = Math.ceil(baseXpRequirement * Math.pow(1 + xpRequirementIncreasePercentage, newJobLevel));

            // Update the user's XP requirement for the next level
            res.xpRequirement = xpRequirement;

            const milestone = 100 * newJobLevel * 2
            const milestoneEmbed = new EmbedBuilder()
                .setTitle('New Job Level Unlocked')
                .setDescription(`Congratulations! You have reached Job Level ${newJobLevel} (${milestone} XP)`);

            // Defer replying to the interaction before sending the reply and follow-up message
               await interaction.reply({embeds: [milestoneEmbed]});
             

            // Send the work embed first
            if (res.job === "streamer"){
                await streamerGame(interaction, jobEarningData);
            } else if (res.job === "cashier"){
                await cashierGame(interaction, jobEarningData);
            } else if (res.job === "doctor") {
                await doctorGame(interaction, jobEarningData);
            } else if (res.job === "police") {
                await policeGame(interaction, jobEarningData);
            }   else if (res.job === "banker") {
                await bankerGame(interaction, jobEarningData);
            }  else if (res.job === "taxi") {
                await taxiGame(interaction, jobEarningData);
            } else if (res.job === "accountant") {
                await accountantGame(interaction, jobEarningData);
            } else if (res.job === "teacher") {
                await teacherGame(interaction, jobEarningData);
            } else if (res.job === "writer") {
                await writerGame(interaction, jobEarningData);
            } else if (res.job === "chef") {
                await chefGame(interaction, jobEarningData);
            } else if (res.job === "engineer") {
                await engineerGame(interaction, jobEarningData);
            } else if (res.job === "artist") {
                await artistGame(interaction, jobEarningData);
            }


            // Add a delay of 2 seconds (2000 milliseconds) before sending the milestone embed
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Check if the interaction has not been replied or deferred before following up
            
        } else {
            if (res.job === "streamer"){
                await streamerGame(interaction, jobEarningData);
            } else if (res.job === "cashier"){
                await cashierGame(interaction, jobEarningData);
            } else if (res.job === "doctor") {
                await doctorGame(interaction, jobEarningData);
            } else if (res.job === "police") {
                await policeGame(interaction, jobEarningData);
            } else if (res.job === "banker") {
                await bankerGame(interaction, jobEarningData);
            } else if (res.job === "taxi") {
                await taxiGame(interaction, jobEarningData);
            } else if (res.job === "accountant") {
                await accountantGame(interaction, jobEarningData);
            } else if (res.job === "teacher") {
                await teacherGame(interaction, jobEarningData);
            } else if (res.job === "writer") {
                await writerGame(interaction, jobEarningData);
            } else if (res.job === "chef") {
                await chefGame(interaction, jobEarningData);
            } else if (res.job === "engineer") {
                await engineerGame(interaction, jobEarningData);
            } else if (res.job === "artist") {
                await artistGame(interaction, jobEarningData);
            } else {
                const workEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('Work')
                    .setDescription(`You worked and earned ${moneyEarned} coins!`);
                    await interaction.reply({ embeds: [workEmbed] });
                // Check if the interaction has not been replied or deferred before replying
                
            }
        }
        // Save the updated user data
        await res.save();
    },
};