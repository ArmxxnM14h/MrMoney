const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all commands'),
    cooldown: {
        duration: 2, // Set the cooldown duration in seconds
      },
  async execute(interaction) {
    
    const commands = interaction.client.commands; 
    const pages = [];
    const maxCommandsPerPage = 5;
    const commandsArray = commands.map(command => command.data.toJSON()); 

    for (let i = 0; i < commandsArray.length; i += maxCommandsPerPage) {
      const pageEmbed = new EmbedBuilder()
        .setTitle('Help - Commands')
        .setColor('Green')
        .setDescription('List of available commands');
      for (let j = i; j < i + maxCommandsPerPage && j < commandsArray.length; j++) {
        const { name, description } = commandsArray[j];
        pageEmbed.addFields({name: name, value: description || 'No description provided.'});
      }
      pages.push(pageEmbed);
    }

    let curPage = 0;
    let collectorEnded = false;

    const arrowLeft = new ButtonBuilder()
      .setCustomId('previous')
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const arrowRight = new ButtonBuilder()
      .setCustomId('next')
      .setEmoji('➡️')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(arrowLeft, arrowRight);

    interaction.reply({
      embeds: [pages[curPage]],
      components: [row],
    });

    const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
      if (i.member.id !== interaction.user.id) {
        return i.reply({
          content: `This interaction is not for you`,
          ephemeral: true,
        });
      }

      if (i.customId === 'next') {
        await i.deferUpdate();

        curPage += 1;
        arrowLeft.setDisabled(false);
        arrowRight.setDisabled(false);

        if (curPage === pages.length - 1) {
          arrowRight.setDisabled(true);
        }

        i.editReply({
          embeds: [pages[curPage]],
          components: [row],
        });
      }

      if (i.customId === 'previous') {
        await i.deferUpdate();

        curPage -= 1;
        arrowLeft.setDisabled(false);
        arrowRight.setDisabled(false);

        if (curPage === 0) {
          arrowLeft.setDisabled(true);
        }

        i.editReply({
          embeds: [pages[curPage]],
          components: [row],
        });
      }
    });

    collector.on('end', () => {

        interaction.editReply({
            embeds: [pages[curPage]],
            components: [], 
        })

    });
  },
};
