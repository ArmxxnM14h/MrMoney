const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  ActionRowBuilder,
  Collector
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Shows all commands')
      .addStringOption((option) =>
          option
          .setName("category")
          .setDescription("choose the category that you want to see")
          .setRequired(true)
          .addChoices({
              name: '🤑 Economy',
              value: 'economy'
          }, {
              name: '❓ Misc',
              value: 'fun'
          }, {
              name: '😂 Fun',
              value: 'misc'
          }, )),

          cooldown: {
            duration: 8, // Set the cooldown duration in seconds
          },
  async execute(interaction) {
    
      const choice = interaction.options.getString('category');
      if (choice === "economy") {
          msg = 'Help menu for Economy'

          let maxPage = 4;
          let curPage = 1;
          let collectorEnded = false;
          const arrowLeft = new ButtonBuilder()
              .setCustomId('previous')
              .setEmoji('⬅️')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true)

          const arrowRight = new ButtonBuilder()
              .setCustomId('next')
              .setEmoji('➡️')
              .setStyle(ButtonStyle.Primary)

          const row = new ActionRowBuilder()
              .addComponents(arrowLeft, arrowRight)

          const page1 = new EmbedBuilder()
              .setTitle('test')
              .setDescription('.')

          const page2 = new EmbedBuilder()
              .setTitle('test')
              .setDescription('PAGE 2')

          const page3 = new EmbedBuilder()
              .setTitle('test')
              .setDescription('PAGE 3')

          const page4 = new EmbedBuilder()
              .setTitle('test')
              .setDescription('PAGE 4')

          let pages = [page1, page2, page3, page4]

          interaction.reply({
              embeds: [pages[curPage - 1]],
              components: [row]
          })


          const collector = interaction.channel.createMessageComponentCollector({
              time: 60000
          });

          collector.on('collect', async i => {
              // check if the author triggered the interaction, handy if you only want it to be used by 1 person
              if (i.member.id != interaction.user.id) {
                  return i.reply({
                      content: `This interaction is not for you`,
                      ephemeral: true
                  })
              }
              if (i.customId == 'next') {
                  // defer the interaction
                  await i.deferUpdate();

                  curPage += 1
                  arrowLeft.setDisabled(false)
                  arrowRight.setDisabled(false)

                  if (curPage == maxPage) {
                      arrowRight.setDisabled(true)
                      arrowLeft.setDisabled(false);
                  }

                  i.editReply({
                      embeds: [pages[curPage - 1]],
                      components: [row]
                  })
              }

              if (i.customId === 'previous') {
                // Defer the interaction
                await i.deferUpdate();
      
                curPage -= 1;
                arrowLeft.setDisabled(false);
                arrowRight.setDisabled(false);
      
                if (curPage === 1) {
                  arrowLeft.setDisabled(true);
                }
      
                i.editReply({
                  embeds: [pages[curPage - 1]],
                  components: [row],
                  })

                  collector.on('end', async () => {
                    // Update flag variable to indicate collector ended
                    collectorEnded = true;
                  });
            
                  // Check collector state every 5 seconds and disable buttons if ended
                  const checkCollectorState = setInterval(() => {
                    if (collectorEnded) {
                      row.components.forEach((component) => {
                        component.setDisabled(true);
                      });
                      clearInterval(checkCollectorState);
                      interaction.editReply({ components: [row] }).catch(console.error);
                    }
                  }, 5000);
              }
          })

      }
  }
}