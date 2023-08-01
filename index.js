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


const mysql = require('mysql')
const canal_logs_WL = '1135766204859023412' // Canal de logs, coloque o ID do seu.

client.on('interactionCreate', interaction => {
   

})


client.on('modalSubmit', async (modal) => {

    modal.member.roles.add("998968121731854468")

    if (modal.customId === 'modal-wl') {

        const id = modal.getTextInputValue('textinput_wl-id');
        const idade = modal.getTextInputValue('textinput_wl-idade');
        const nome = modal.getTextInputValue('textinput_wl-nome');

        modal.member.setNickname(`${nome} | ${id}`)

        const embed_log = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle(`Membro aprovado`)
            .addField('ID', id)
            .addField('Idade', idade)
            .addField('Nome', nome)

        // Parte do MYSQL, nao altere.
        let connection = mysql.createPool({
            host: '127.0.0.1', // IP da database. Se estiver em localhost deixe 127.0.0.1.
            user: 'root', // Usuario da database, padrao root.
            password: '', // Senha da database, padrao sem senha.
            database: 'vrpex' // Nome da database.
        });

        let sql = `UPDATE vrp_users SET whitelisted = '1' WHERE id = '${id}'` // Dando set no banco de dados.
        connection.query(sql, function (err, result) { // Query da conexao.
            if (err) throw err; // Se houver algum erro, exibir no console.
            // [LOG] Enviando a mensagem no canal definido.
            const channel = client.channels.cache.get(canal_logs_WL)
            channel.send({ embeds : [embed_log] })

            // Enviando mensagem na DM do membro.
            const user = modal.user;

            const embed_dm = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setAuthor(modal.guild.name)
            .setDescription(`Parabéns ${modal.user}! Você \`passou\` no formulário e agora já pode se conectar ao servidor normalmente!`)
            .setFooter(`connect ...... (IP da cidade para que o membro possa se conectar.)`)

            user.send({ embeds: [embed_dm ]})

            modal.reply({ content: `⚙ Vou te avisar no privado quanto ao resultado!`, ephemeral: true });
        })

    }
})
