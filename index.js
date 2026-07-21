require('dotenv').config();
const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // 👈 IMPORTANTE para leer mensajes
  ]
});

client.commands = new Collection();

// 📂 Cargar comandos
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ⚡ Ejecutar comandos slash
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  await command.execute(interaction, client);
});

// 🔥 BOT LISTO
client.once('ready', () => {
  console.log(`🔥 Bot listo: ${client.user.tag}`);
});


// =======================
// 🛡️ ANTIRAID (AQUÍ VA)
// =======================
let mensajes = new Map();

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const now = Date.now();
  const userData = mensajes.get(message.author.id) || [];

  userData.push(now);
  mensajes.set(message.author.id, userData);

  const recientes = userData.filter(t => now - t < 5000);

  if (recientes.length > 5) {
    if (message.member) {
      message.member.timeout(60000, "Spam detectado");
      message.channel.send(`🚫 ${message.author} muteado por spam`);
    }
  }
});


// 🔐 LOGIN
client.login(process.env.TOKEN);