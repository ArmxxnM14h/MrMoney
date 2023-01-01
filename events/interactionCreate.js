module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        console.log(client, interaction)
        const command = client.commands.get(interaction.commandName);
    
    
        if (!command) {
            interaction.reply({ content: "Command is not found, for more info please visit => https://discord.gg/7EZV3BUDNx", ephemeral: true })
        }
        const timer = ms => new Promise(res => setTimeout(res, ms));
    
        if (command.cooldowns != undefined && command.cooldown == undefined || command.cooldowns == undefined && command.cooldown != undefined) {
            console.error(`${command.data.name} has not got a cooldowns list but does have a cooldown. Fix this.`)
        }
        if (command.cooldowns != undefined) {
            if (command.cooldowns.has(interaction.member.id)) {
                const cooldowntime = prettyMilliseconds(command.cooldown * 1000)
                const CooldownEmbed = new Discord.MessageEmbed()
                    .setTitle('CoolDown alert!')
                    .setDescription(`Seems your on cooldown, you only need to wait ${cooldowntime}`)
                    .setColor('RANDOM')
                return await interaction.reply({ embeds: [CooldownEmbed] })
            }
        }
    
    
        try {
            await command.execute(interaction);
            if (command.cooldowns != undefined && command.cooldown != undefined) {
    
                command.cooldowns.add(interaction.member.id)
    
                await timer(command.cooldown * 1000)
    
                command.cooldowns.delete(interaction.member.id)
            }
        } catch (error) {
            console.error(error)
            return interaction.reply({ content: 'There was an error while executing this command!\n If you want, you can send the following error to our support server.\n``` js ' + error + '```', ephemeral: true, });
    
        }
    }
}
