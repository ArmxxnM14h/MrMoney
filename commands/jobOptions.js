const { SlashCommandBuilder } = require('@discordjs/builders');
const {  EmbedBuilder } = require('discord.js');
const schema = require("../models/userschema.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('job')
		.setDescription('set your job')
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
            { name: 'Cashier', value: 'cashier' }
          )
        )
      ),
      
      cooldown: {
        duration: 7, // Set the cooldown duration in seconds
      },
	async execute(interaction) {
    const res = await schema.findOne({ userID: interaction.user.id })
        const command = interaction.options.getSubcommand();
        
        switch (command){

        case 'set':

// Command ONE
        
         
          if (!res) {
            return interaction.reply({content: "First time users need to use the bal command to start", ephemeral: true})
          }
          if (res.job !== "unemployed") {
            return interaction.reply({content: "You already have a job", ephemeral: true})
            
          }


            if (res.job === "unemployed") {
const choice = interaction.options.getString('list');

if (choice == "banker") {
    if (res.workxp < 300) {
        const work = new EmbedBuilder()
        .setColor('Random')
        .setTitle("Unable to employ")
        .setDescription("You need to work more to be able to become a banker")
        .setTimestamp()
        interaction.reply({ embeds: [work] });


    } else {


    res.job = "Banker";
    res.save();
    const bankerEmbed = new EmbedBuilder()
    .setTitle('Banker')
    .setDescription(`:moneybag: **Banker:** :moneybag:
    you have been hired as a banker!`)
    .setColor('Random')
    return await interaction.reply({embeds: [bankerEmbed]})
    }   

} else if (choice === "accountant") {
    if (res.workxp < 1000) {
        const work = new EmbedBuilder()
        .setColor('Random')
        .setTitle("Unable to employ")
        .setDescription("You need to work more to be able to become an accountant")
        .setTimestamp()
        interaction.reply({ embeds: [work] });
    } else {    
    res.job = "Accountant";
    res.save();
    const accountantEmbed = new EmbedBuilder()
    .setTitle('Accountant')
    .setDescription(`:moneybag: **Accountant:** :moneybag:
    you have been hired as an accountant!`)
    .setColor('RANDOM')
    return await interaction.reply({embeds: [accountantEmbed]})
    }
}
else if (choice === "streamer") {
    res.job = "Streamer";
    res.save();
    const streamerEmbed = new EmbedBuilder()
    .setTitle('Streamer')
    .setDescription(`:moneybag: **Streamer:** :moneybag:
    you have been hired as a streamer!`)
    .setColor('RANDOM')
    return await interaction.reply({embeds: [streamerEmbed]})
}
else if (choice === "taxi") {
    if (res.workxp < 200) {
        const work = new EmbedBuilder()
        .setColor('Random')
        .setTitle("Unable to employ")
        .setDescription("You need to work more to be able to become a taxi driver")
        .setTimestamp()
        interaction.reply({ embeds: [work] });
    } else {
    res.job = "Taxi";
    res.save();
    const taxiEmbed = new EmbedBuilder()
    .setTitle('Taxi')
    .setDescription(`:moneybag: **Taxi:** :moneybag:
    you have been hired as a Taxi driver!`)
    .setColor('Random')
    return await interaction.reply({embeds: [taxiEmbed]})
    }
}
else if (choice === "police") {
    if(res.workxp < 150) {
        const work = new EmbedBuilder()
        .setColor('Random')
        .setTitle("Unable to employ")
        .setDescription("You need to work more to be able to become a police officer")
        .setTimestamp()
        interaction.reply({ embeds: [work] });
    } else {
    res.job = "Police";
    res.save();
    const policeEmbed = new EmbedBuilder()
    .setTitle('Police')
    .setDescription(`:moneybag: **Police:** :moneybag:
    you have been hired as a police officer!`)
    .setColor('Random')
    return await interaction.reply({embeds: [policeEmbed]})
    }

} else if (choice === "cashier") {
    res.job = "Cashier";
    res.save();
    const cashierEmbed = new EmbedBuilder()
    .setTitle('Cashier')
    .setDescription(`:moneybag: **Cashier:** :moneybag:
    you have been hired as a cashier!`)
    .setColor('Random')
    return await interaction.reply({embeds: [cashierEmbed]})
}
            }
          }

    switch (command){
      case 'view':
  
    
        if (!res) {
          const errEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('An error has occured')
          .setFooter('Contact Support.')
          .setColor('Red')
          return interaction.reply({embeds: [errEmbed], ephemeral: true})
        }
    
      if(res.workxp < 300) {
    bankEmoji = "<:red:903369899093680169>"
      } else {
    bankEmoji = "<:green:903369570100850688>"
      } if (res.workxp < 1000) {
    accountantEmoji = "<:red:903369899093680169>"
      } else {
      accountantEmoji = "<:green:903369570100850688>"
      } if (res.workxp < 200){
       taxiEmoji = "<:red:903369899093680169>"
      } else {
        taxiEmoji = "<:green:903369570100850688>"
        } if (res.workxp < 150){
        policeEmoji = "<:red:903369899093680169>"
        } else {
        policeEmoji = "<:green:903369570100850688>"
        } 
    
    const viewJob = new EmbedBuilder()
    .setColor('Random')
    .setTitle("Jobs")
    .setDescription(`
    Key: 
    <:red:903369899093680169>: Job Unavailable
    <:green:903369570100850688>: Job Available
    
    1) **Banker** - 20XP per Hour, 300 Coins per Hour - ${bankEmoji}
    
    2) **Accountant** - 40XP per Hour, 600 Coins per Hour - ${accountantEmoji}
    
    3) <:money_streamer:958783889478938644> **Streamer** - 5XP per Hour, 100 Coins per Hour - <:green:903369570100850688>
    
    4) **Taxi Driver** - 20XP per Hour, 200 Coins per Hour - ${taxiEmoji}
    
    5) **Police** - 15XP per Hour, 200 Coins per Hour - ${policeEmoji}
    
    6) **Cashier** - 5XP per Hour, 100 Coins per Hour - <:green:903369570100850688>`) 
    .setTimestamp()
    interaction.reply({ embeds: [viewJob] });
    
  }
      switch(command){
        case 'quit':

            if (!res) {
                const errEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('An error has occured')
          .setFooter('Contact Support.')
          .setColor('Red')
          return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }
            
            if (res.job === "unemployed") {
                const errEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`${interaction.user.username} hasn't got a job yet!!`)
                    .setTimestamp();
                interaction.reply({ embeds: [errEmbed] });
            } else {
        const quitJob = new EmbedBuilder()
        .setColor('Random')
        .setTitle("You Quit Your Job")
        .setDescription(`You quit your job as a ${res.job}... You're not working anymore`)
        .setTimestamp()
        interaction.reply({ embeds: [quitJob] });
res.job = "unemployed";
res.save();

            }
          }
  }
}