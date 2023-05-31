const { ActivityType } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {

        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.data.name, command);
        }
            
        require('../connectToMongo.js')
        
        const activities = [
          `/help`,
          `money`,
          `Mr Money Support`
          //y'all can add more ig
        ];
        let i = 0;
        const type = ActivityType.Listening
        setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`,{ type }), 5000);
    },
}
console.log("ReadyEvent loaded")