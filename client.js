const { GatewayIntentBits, Client } = require("discord.js")

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
module.exports = client
