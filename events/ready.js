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
        setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: `LISTENING` }), 5000);
    },
};