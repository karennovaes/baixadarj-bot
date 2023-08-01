// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, Partials } = require('discord.js')
const { Modal, TextInputComponent, showModal } = require('discord-modals');

// dotenv
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN } = process.env


// Create a new client instance
const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
    ]
  });


// Importação dos comandos
const fs = require("node:fs")
const path = require("node:path")

const commandsPath = path.join(__dirname,"commands") 
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")) 
//console.log(commandFiles) // Log de comandos existentes

client.commands = new Collection()
for (const file of commandFiles){
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
    } else  {
        console.log(`Esse comando em ${filePath} está com "data" ou "execute ausentes"`)
    } 
}


// Login do bot
client.once(Events.ClientReady, c => {
	console.log(`Pronto! Login realizado como ${c.user.username}`)
});
client.login(TOKEN)


// Listener de interações com o bot
client.on(Events.InteractionCreate, async interaction =>{
    if (!interaction.isChatInputCommand()) return
     //console.log(interaction)
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
        console.error("Comando não encontrado")
        return
    }
    try {
        await command.execute(interaction)
    } 
    catch (error) {
        console.error(error)
        await interaction.reply("Houve um erro ao executar esse comando!")
    }
})





