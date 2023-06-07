const { SlashCommandBuilder } = require("discord.js")

async function execute(interaction) {
  await interaction.reply("Pong!")
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute
}
