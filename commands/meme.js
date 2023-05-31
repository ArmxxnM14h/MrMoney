const { SlashCommandBuilder } = require('@discordjs/builders');
const { Discord, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const url = 'https://www.reddit.com/r/meme/hot/.json?limit=100';
const server = 'https://www.reddit.com/r/meme';
const https = require('https');
module.exports = {

    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a meme'),
    cooldowns: new Set(),
    cooldown: 10,
    async execute(interaction, client) {
        https.get(url, (result) => {
            var body = ''
            result.on('data', (chunk) => {
                body += chunk
            })
            result.on('end', () => {
                var response = JSON.parse(body)
                var index = response.data.children[Math.floor(Math.random() * 99) + 1].data
                if (index.post_hint !== 'image') {
                    const yeah = new ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setLabel('View Subreddit')
                                .setStyle(ButtonStyle.Link)
                                .setURL('https://www.reddit.com/r/meme'),
                        );
                    var text = index.selftext
                    const textembed = EmbedBuilder()
                        .setTitle(subRedditName)
                        .setColor('Random')
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                    interaction.reply({ embeds: [textembed], components: [yeah] })
                }
                var image = index.preview.images[0].source.url.replace('&amp;', '&')
                var title = index.title
                var link = 'https://reddit.com' + index.permalink
                var subRedditName = index.subreddit_name_prefixed
                if (index.post_hint !== 'image') {
                    const hello = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel('View Subreddit')
                                .setStyle(ButtonStyle.Link)
                                .setURL('https://www.reddit.com/r/meme'),
                        );
                    const textembed = new Discord.RichEmbed()
                        .setTitle(subRedditName)
                        .setColor("Random")
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)
                    interaction.reply({ embeds: [textembed], components: [hello] })
                }

                const hi = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('View Subreddit')
                            .setStyle('LINK')
                            .setURL('https://www.reddit.com/r/meme'),
                    );
                const imageembed = new EmbedBuilder()
                    .setTitle(subRedditName)
                    .setImage(image)
                    .setColor("Random")
                    .setDescription(`[${title}](${link})`)
                    .setURL(`https://reddit.com/${subRedditName}`)
                interaction.reply({ embeds: [imageembed], components: [hi] })
            }).on('error', function (e) {
                console.log('Got an error with memes lol: ', e)
            })
        })
    },

};