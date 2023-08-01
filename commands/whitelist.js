const {SlashCommandBuilder} = require("discord.js");
const mysql = require('mysql')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Whitelist")
	.addStringOption(option =>
		option.setName('id')
			.setDescription('ID do personagem')),


    async execute(interaction){
        const user = interaction.user
        let connection = mysql.createPool({
            host: '127.0.0.1', // IP da database. Se estiver em localhost deixe 127.0.0.1.
            user: 'root', // Usuario da database, padrao root.
            password: '', // Senha da database, padrao sem senha.
            database: 'vrpex' // Nome da database.
        });
       let id = interaction.options.getString("id")
        let sql = `UPDATE vrp_users SET whitelisted = '1' WHERE id = '${id}'` // Dando set no banco de dados.
        connection.query(sql, function (err, result) { 
            if (err) throw err;

        })
        interaction.reply({ content: "Aprovado!" })
        interaction.deleteReply()    

        
    }
}
