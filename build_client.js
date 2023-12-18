const fs = require("node:fs")
const path = require("node:path")
const { Collection } = require("discord.js")
const { job } = require("./commands/watch")
const { existsSync, readFileSync } = require("fs")

const client = require("./client")

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
  if (
    existsSync(process.env.WATCHED_STATUS_PATH) &&
    readFileSync(process.env.WATCHED_STATUS_PATH, "utf8") == "1"
  ) {
    job.start()
  }
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
