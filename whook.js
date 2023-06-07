const fs = require("node:fs")
const path = require("node:path")
const express = require("express")
const cors = require("cors")

const routesPath = path.join(__dirname, "routes")
const whook = express().use(express.json())
whook.use(
  cors({
    origin: process.env.API_URL,
    credentials: true
  })
)
whook.disable("x-powered-by")

fs.readdirSync(routesPath)
  .filter(file => file.endsWith(".js"))
  .forEach(file => {
    const { subpath, router } = require(path.join(routesPath, file))
    whook.use(subpath, router)
  })

whook._listen = whook.listen
whook.listen = port => {
  whook._listen(port, () => {
    console.log(`WebHook Listening on Port ${port}!`)
  })
}

module.exports = whook
