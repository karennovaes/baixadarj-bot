const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responde com 'Pong!"),

    async execute(interaction) { // o que vai ser executado quando fizer o comando
        await interaction.reply("Pong!")
    }
}