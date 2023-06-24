const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme'),
    cooldown: {
        duration: 8,
    },
  async execute(interaction) {
    try {
      const response = await axios.get('https://www.reddit.com/r/memes/random.json');
      const post = response.data[0].data.children[0].data;

      const title = post.title;
      const url = post.url;
      const author = post.author;
      const ups = post.ups;
      const subreddit = post.subreddit_name_prefixed;

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setURL(`https://www.reddit.com${post.permalink}`)
        .setColor('#FF4500')
        .setImage(url)
        .setFooter({ text: `Posted by u/${author} in ${subreddit} | 👍 ${ups}`})
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching meme:', error);
      await interaction.reply('Sorry, there was an error while fetching the meme.');
    }
  },
};
