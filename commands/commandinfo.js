const { MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("commandinfo")
    .setDescription("command info (description and others)")
    .addStringOption(option =>
        option
        .setName("commandname")
        .setDescription("name of the command u want info of")
        .setRequired(true)
        ),
   cooldowns: new Set(),
    cooldown: 3,
    
    async execute(interaction) {
  const commandname = interaction.options.getString("commandname")
        const command = interaction.client.commands.get(commandname)

        if(!command){
const embed = new MessageEmbed()
.setTitle('Unknown Command')
.setDescription('After checking our commands section we couldnt find your command, maybe use a command from the /command menu')
.setColor('RANDOM')
return interaction.reply({embeds: [embed], ephemeral: true})
        } else {

        const embed = new MessageEmbed()
.setTitle(`Command Information`)
.setDescription(`Seems your looking for command information, here is some info that you might be looking for!

**Command name:** ${command.data.name}

**Description of command:** ${command.data.description}

**Cooldown Length:** ${command.cooldown} seconds
`)
.setColor('RANDOM')
await interaction.reply({embeds: [embed]})
          }
        }
}