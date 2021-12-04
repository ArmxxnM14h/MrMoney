
const Discord = require('discord.js')
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, guildId } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
require('./connectToMongo.js')
console.log('online')
     const activities = [
    `/help`,
    `money`,
    `Mr Money Support`
    //y'all can add more ig
  ];
  let i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: `LISTENING` }), 5000);
});
client.on('interactionCreate', async interaction => {
const command = client.commands.get(interaction.commandName);

	if (!command) return; 
const timer = ms => new Promise( res => setTimeout(res, ms));

if(command.cooldowns != undefined && command.cooldown == undefined || command.cooldowns == undefined && command.cooldown != undefined) {
                console.error(`${command.data.name} has not got a cooldowns list but does have a cooldown. Fix this.`)
            }
            if(command.cooldowns != undefined) {
                if(command.cooldowns.has(interaction.member.id)) {
                   const CooldownEmbed = new Discord.MessageEmbed()
                    .setTitle('CoolDown alert!')
                      .setDescription(`Seems your on cooldown, you only need to wait ${command.cooldown}s`)
                        .setColor('RANDOM')
                    return await interaction.reply({embeds: [CooldownEmbed]})
                      console.log(cooldowns)
                }
            }

	try {
		await command.execute(interaction);
if(command.cooldowns != undefined && command.cooldown != undefined){

                    command.cooldowns.add(interaction.member.id)
    
                    await timer(command.cooldown * 1000)
        
                    command.cooldowns.delete(interaction.member.id)
}               
	} catch (error) {
		console.error(error)
		return interaction.reply({ content: 'There was an error while executing this command!\n If you want, you can send the following error to our support server.\n``` js '+ error + '```', ephemeral: true, });

	}
});
client.login(token);
