const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

let warns = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Advertir a un usuario')
    .addUserOption(opt =>
      opt.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(opt =>
      opt.setName('razon').setDescription('Razón').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon');

    if (!warns[user.id]) warns[user.id] = [];

    warns[user.id].push(reason);

    await interaction.reply(`⚠️ ${user.tag} advertido. Total: ${warns[user.id].length}`);
  }
};