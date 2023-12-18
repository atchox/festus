const client = require("./build_client")
const whook = require("./whook")

client.login(process.env.BOT_TOKEN)
whook.listen(process.env.WHOOK_PORT || 3000)
