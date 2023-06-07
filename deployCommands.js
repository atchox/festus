const fs = require("node:fs")
const path = require("node:path")
const { REST, Routes } = require("discord.js")

const commands = []
const commandsPath = path.join(__dirname, "commands")

fs.readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"))
  .forEach(file => {
    const command = require(path.join(commandsPath, file))
    commands.push(command.data.toJSON())
  })

new REST()
  .setToken(process.env.BOT_TOKEN)
  .put(
    Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID),
    { body: commands }
  )
  .then(() => console.log("Commands Registered!"))
  .catch(console.error)
