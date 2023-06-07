const { SlashCommandBuilder } = require("discord.js")

async function execute(interaction) {
  await interaction.reply(
    "Hi,\nI am Festus, a friendly bot at your service who ocassionally breathes fire.\nWhile I am the creation of Atreya, I have no master and I do as I please."
  )
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("intro")
    .setDescription("Festus introduces himself!"),
  execute
}
