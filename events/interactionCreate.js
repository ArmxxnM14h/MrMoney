const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection} = require("discord.js");
const usersDb = require("../models/userschema.js")
const Cooldown = require('../models/cooldownSchema.js')

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        const Discord = require("discord.js")
        const prettyMilliseconds = require("pretty-ms")


        if (!interaction.guild) return
        if (interaction.isButton()) {
            if (interaction.customId == "accept_tos") {
                if(interaction.user.id != interaction.message.interaction.user.id) return interaction.reply({ content: "You can't accept the TOS for someone else!", ephemeral: true })
                let user = await usersDb.findOne({ userID: interaction.user.id })
                user.acceptedTos = true
                await user.save();
                
                let row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("accept_tos")
                        .setLabel("Accept")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true)
                )

                const embed = new Discord.EmbedBuilder()
                .setTitle('Accepted Rules!')
                .setDescription(`:tada: Welcome to Mr Money :tada:
                > Keep in mind that breaking rules has consequences

                > To start we have put $100 in your account
                
                We hope you enjoy our bot and if you ever need help you can run **/support** to gain help`)
                .setColor('Green')
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
                    job: "unemployed",
                    workxp: 0,
                    inventory: [],
                    acceptedTos: false,
                })
    
                await newUser.save().catch((err) => console.log(err))
    
                user = newUser
        
            }
    
            if (!user.acceptedTos) {
                let embed = new Discord.EmbedBuilder()
                .setTitle(
                    "MrMoney - Terms of Service"
                ).setDescription(`
                Welcome to MrMoney - You must follow these rules or it may result in a ban/blacklist.

                    **1. Alting**
                    You are not allowed to use alts to gain an advantage in gaining income. 
                     
                    **2. Scripts**
                    You cannot use scripts to maybe spam commands or AFK grind.
                    
                    **3. Scamming**
                    You cannot use our bot to scam other users of discord. 

                    **4. Sharing Scripts** 
                    Sharing scripts is counted as directly being involved in scripting and will not be tolerated.
                `)
                 .setColor('Aqua')
                let row = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("accept_tos")
                        .setLabel("Accept")
                        .setStyle(ButtonStyle.Primary)
                )


                return await interaction.reply({
                    components: [row],
                    embeds: [embed],
                    fetchReply: true,
                })
    
            } else {
                const command = client.commands.get(interaction.commandName);
                if (!interaction.isChatInputCommand()) return;
                if (!command) {
                    return interaction.reply({
                        content: "DAMN COMMAND NOT EXIST MISSION FAILED SHUUUUUSH",
                    })
                }
                const userId = interaction.user.id;
                const commandName = interaction.commandName


                const cooldown = await Cooldown.findOne({ userId, command: commandName });
                if (cooldown && cooldown.cooldownExpires > new Date()) {
                    const remainingCooldown = Math.ceil((cooldown.cooldownExpires - new Date()) / 1000);
                    const cooldownTimestamp = `<t:${Math.round((Date.now() + remainingCooldown * 1000) / 1000)}:R>`;
                  await interaction.reply({content: `You're on cooldown for this command. Try again in ${cooldownTimestamp}.`, ephemeral: true});
                  return;
                }
                          
    
                try {
                    await command.execute(interaction)
                    // Check if user is on cooldown
                    const cooldownExpires = new Date();
                    cooldownExpires.setSeconds(cooldownExpires.getSeconds() + command.cooldown.duration);
                    await Cooldown.findOneAndUpdate(
                      { userId, command: commandName },
                      { cooldownExpires },
                      { upsert: true },
                    );
                  
                    

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