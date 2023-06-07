const fs = require("node:fs")
const path = require("node:path")
const { Client, GatewayIntentBits, Collection } = require("discord.js")

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

const commandsPath = path.join(__dirname, "commands")
fs.readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"))
  .forEach(file => {
    const command = require(path.join(commandsPath, file))
    client.commands.set(command.data.name, command)
  })

client.once("ready", () => {
  console.log("Bot Running!")
})

client.on("interactionCreate", async interaction => {
  if (
    !interaction.isCommand() ||
    !(command = client.commands.get(interaction.commandName))
  )
    return

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: "Error executing command!",
      ephemeral: true
    })
  }
})

module.exports = client
