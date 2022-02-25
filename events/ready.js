module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
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
