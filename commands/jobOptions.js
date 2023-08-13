const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const schema = require("../models/userschema.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('job')
        .setDescription('Options for job related commands!')
        .addSubcommand(command => command
            .setName('view')
            .setDescription('view your work'))
        .addSubcommand(command => command
            .setName('quit')
            .setDescription('quit work.'))
        .addSubcommand(group => group.setName('set').setDescription('Set your work!')
            .addStringOption(o => o.setName('list')
                .setDescription('Check out these jobs.')
                .setRequired(true)
                .addChoices(
                    { name: 'Banker', value: 'banker' },
                    { name: 'Accountant', value: 'accountant' },
                    { name: 'Streamer', value: 'streamer' },
                    { name: 'Taxi', value: 'taxi' },
                    { name: 'Police', value: 'police' },
                    { name: 'Cashier', value: 'cashier' },
                    { name: 'Doctor', value: 'doctor'},
                  { name: 'Chef', value: 'chef' },
                  { name: 'Engineer', value: 'engineer' },
                  { name: 'Artist', value: 'artist' },
                  { name: 'Teacher', value: 'teacher' },
                  { name: 'Writer', value: 'writer' },
                )
            )
        ),

    cooldown: {
        duration: 5,
    },

    async execute(interaction) {
        const res = await schema.findOne({ userID: interaction.user.id })
        const command = interaction.options.getSubcommand();

        switch (command) {
          case 'set':
            if (!res) {
                return interaction.reply({
                    content: "Please contact support",
                    ephemeral: true,
                });
            }
            if (res.job !== "unemployed") {
                return interaction.reply({
                    content: "You already have a job",
                    ephemeral: true,
                });
            }

            const choice = interaction.options.getString('list');
            const jobLevelThresholds = {
                banker: 2,
                accountant: 3,
                taxi: 1,
                police: 1,
                cashier: 0,
                streamer: 0,
                doctor: 15,
                chef: 7,
                engineer: 9,
                artist: 11,
                teacher: 5,
                writer: 6,
            };

            const requiredLevel = jobLevelThresholds[choice];
            const currentLVL = res.totalJobLevel;

            if (currentLVL >= requiredLevel) {
                res.job = choice;
                await res.save();

                const jobTitle = choice.charAt(0).toUpperCase() + choice.slice(1);
                const jobEmbed = new EmbedBuilder()
                    .setTitle(
                        `Hired!`)
                    .setDescription(` 
                    > :partying_face: **${jobTitle}:** \nYou have been hired as a ${jobTitle}!`)
                    .setColor('Random');

                return interaction.reply({ embeds: [jobEmbed] });
            } else {
                const work = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle("Unable to employ")
                    .setDescription(`You need to be level ${requiredLevel} to work as ${choice}`)
                    .setTimestamp();

                return interaction.reply({ embeds: [work] });
            }

          }  switch (command) {
            case 'view':
              if (!res) {
                  const errEmbed = new EmbedBuilder()
                      .setTitle('Error')
                      .setDescription('An error has occurred')
                      .setFooter('Contact Support.')
                      .setColor('Red')
                  return interaction.reply({ embeds: [errEmbed], ephemeral: true })
              }
          
              const jobsPerPage = 6;
                const totalJobs = 12; // Total number of jobs available
                const totalPages = Math.ceil(totalJobs / jobsPerPage);
                let page = 1;

              const jobs = [
                  { name: 'Streamer', description: 'Stream videos online.', requiredlvl: 0 },
                  { name: 'Cashier', description: 'Help people buy items', requiredlvl: 0 },
                  { name: 'Taxi', description: 'Give people rides around town', requiredlvl: 1 },
                  { name: 'Police', description: 'Stop the crime in the city', requiredlvl: 1 },
                  { name: 'Banker', description: 'Work in the bank.', requiredlvl: 2 },
                  { name: 'Accountant', description: 'Manage finances.', requiredlvl: 3 },
                  { name: 'Teacher', description: 'Teach the noobs how its done', requiredlvl: 5 },
                  { name: 'Writer', description: 'Become a world famous writer', requiredlvl: 6 },
                  { name: 'Chef', description: 'Be the next Gordon Ramsay', requiredlvl: 7 },
                  { name: 'Engineer', description: 'Create and repair items', requiredlvl: 9 },
                  { name: 'Artist', description: 'Create the best art ever seen', requiredlvl: 11 },
                  { name: 'Doctor', description: 'Cure diseases, Save patients', requiredlvl: 15 },
              ];
          
              function createEmbed(page) {
                const viewJob = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle("Available Jobs:")
                    .setDescription(`
                         Key: <:green:903369570100850688>: Available <:red:903369899093680169>: Unavailable
                    `);

                const startIndex = (page - 1) * jobsPerPage;
                const endIndex = Math.min(startIndex + jobsPerPage, totalJobs);

                for (let i = startIndex; i < endIndex; i++) {
                    const job = jobs[i];
                    const xpRequirement = job.requiredlvl;
                    const currentXP = res.totalJobLevel;
                    const jobEmoji = currentXP >= xpRequirement ? "<:green:903369570100850688>" : "<:red:903369899093680169>";
                    viewJob.addFields({
                        name: `> ${job.name}`,
                        value: `${job.description || ''} - ${xpRequirement} Level required - ${jobEmoji}`,
                        inline: false
                    });
                }

                viewJob.setTimestamp();
                return viewJob;
            }

            const embed = createEmbed(page);
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(totalPages === 1),
                );

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = (interaction) => {
                return interaction.user.id === res.userID;
            };

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'previous') {
                    page--;
                    if (page <= 1) {
                        page = 1;
                        row.components[0].setDisabled(true);
                    }
                    row.components[1].setDisabled(false);
                } else if (interaction.customId === 'next') {
                    page++;
                    if (page >= totalPages) {
                        page = totalPages;
                        row.components[1].setDisabled(true);
                    }
                    row.components[0].setDisabled(false);
                }

                const newEmbed = createEmbed(page);
                interaction.update({ embeds: [newEmbed], components: [row] });
            });

            collector.on('end', async () => {
                row.components.forEach((component) => {
                    component.setDisabled(true);
                });

                const finalEmbed = createEmbed(page);
                interaction.editReply({ embeds: [finalEmbed], components: [row] });
            });
            break;

            case 'quit':

                if (!res) {
                    const errEmbed = new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('An error has occurred')
                        .setFooter('Contact Support.')
                        .setColor('Red')
                    return interaction.reply({ embeds: [errEmbed], ephemeral: true })
                }

                if (res.job === "unemployed") {
                    const errEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`${interaction.user.username} hasn't got a job yet!`)
                        .setTimestamp();
                    return interaction.reply({ embeds: [errEmbed] });
                } else {
                    const quitJob = new EmbedBuilder()
                        .setColor('Random')
                        .setTitle("You Quit!")
                        .setDescription(`You quit your job as a ${res.job}.`)
                        .setTimestamp();
                    interaction.reply({ embeds: [quitJob] });

                    // Reset job and XP
                    res.job = "unemployed";
                    res.workxp = 0;
                    res.save();
                }
                break;

            default:
                const errEmbed = new EmbedBuilder()
                    .setTitle('Invalid Subcommand')
                    .setDescription('Please select a valid subcommand.')
                    .setColor('Red')
                    .setTimestamp();
                return interaction.reply({ embeds: [errEmbed] });
        }
    }
}
