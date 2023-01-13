const { stripIndents } = require("common-tags")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const usersDb = require("../models/userschema.js")
const wait = require('util').promisify(setTimeout);
module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        const Discord = require("discord.js")
        const prettyMilliseconds = require("pretty-ms")

        if (interaction.isButton()) {
            if (interaction.customId == "accept_tos") {
                if(interaction.user.id != interaction.message.interaction.user.id) return interaction.reply({ content: "You can't accept the TOS for someone else!", ephemeral: true })
                let user = await usersDb.findOne({ userID: interaction.user.id })
                user.acceptedTos = true
                await user.save();
                
                let row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("accept_tos")
                        .setLabel("Accept")
                        .setStyle("SUCCESS")
                        .setDisabled(true)
                )

                const embed = new MessageEmbed()
                .setTitle('Accepted Rules!')
                .setDescription('SOON:TM:')
               await interaction.update({
            embeds: [embed],
            components: [row]
            })

               
            }
        } else if(interaction.isCommand()) {
            let user = await usersDb.findOne({ userID: interaction.user.id })

            if (!user) {
                const newUser = new usersDb({
                    userID: interaction.user.id,
                    userName: interaction.user.username,
                    serverID: interaction.guild.id,
                    coins: 100,
                    bank: 0,
                    job: "Unemployed",
                    workxp: 0,
                    inventory: [
                        { name: "Golden Potato", count: 1, itemType: "Consumable" },
                    ],
                    acceptedTos: false,
                })
    
                await newUser.save().catch((err) => console.log(err))
    
                user = newUser
        
            }
    
            if (!user.acceptedTos) {
                let embed = new MessageEmbed()
                .setTitle(
                    "MrMoney - Terms of Service"
                ).setDescription(stripIndents`
                    **1. idk**
                    blah blah lorem ipsum u know
    
                    **2. same thing**
                    u got this
                `)
    
                let row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("accept_tos")
                        .setLabel("Accept")
                        .setStyle("SUCCESS")
                )


                return await interaction.reply({
                    components: [row],
                    embeds: [embed],
                    fetchReply: true,
                })
    
            } else {
                const command = client.commands.get(interaction.commandName);

                if (!command) {
                    return interaction.reply({
                        content: "DAMN COMMAND NOT EXIST MISSION FAILED SHUUUUUSH",
                    })
                }
                if (
                    (command.cooldowns != undefined &&
                        command.cooldown == undefined) ||
                    (command.cooldowns == undefined &&
                        command.cooldown != undefined)
                ) {
                    console.error(
                        `${command.data.name} has not got a cooldowns list but does have a cooldown. Fix this.`
                    )
                }
    
                if (command.cooldowns != undefined) {
                    if (command.cooldowns.has(interaction.member.id)) {
                        const cooldowntime = prettyMilliseconds(
                            command.cooldown * 1000
                        )
                        const CooldownEmbed = new Discord.MessageEmbed()
                            .setTitle("CoolDown alert!")
                            .setDescription(
                                `Seems your on cooldown, you only need to wait ${cooldowntime}`
                            )
                            .setColor("RANDOM")
                        return await interaction.reply({ embeds: [CooldownEmbed] })
                    }
                }
    
                try {
                    await command.execute(interaction)
                    if (
                        command.cooldowns != undefined &&
                        command.cooldown != undefined
                    ) {
                        command.cooldowns.add(interaction.member.id)
    
                        setTimeout(
                            () => command.cooldowns.delete(interaction.member.id),
                            command.cooldown * 1000
                        )
                    }
                } catch (error) {
                    console.error(error)
                    return interaction.reply({
                        content:
                            "There was an error while executing this command!\n If you want, you can send the following error to our support server.\n``` js " +
                            error +
                            "```",
                        ephemeral: true,
                    })
                }
            }
        }
    },
}
