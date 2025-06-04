const { SlashCommandBuilder } = require("discord.js")
const { CronJob } = require("cron")
const { parse } = require("node-html-parser")
const { existsSync, readFileSync, writeFileSync } = require("fs")

const client = require("../client")

const checkForUpdates = async () => {
  try {
    const channel = await client.channels.fetch(
      `${process.env.WOKO_CHANNEL_ID}`
    )
    if (!channel.isTextBased()) {
      console.error(`Not TextBased Channel: ${channel.name}`)
    }
    const response = await fetch(process.env.WOKO_URL)
    const root = parse(await response.text())
    let x = root.getElementById("GruppeID_98")
    x = x.removeWhitespace().lastChild.removeWhitespace().firstChild.childNodes
    const arr = []
    x.forEach(el => {
      arr.push(
        el.firstChild.firstChild.firstChild.removeWhitespace().firstChild
          .lastChild.text
      )
    })
    if (!existsSync(process.env.WATCHED_PATH)) {
      writeFileSync(process.env.WATCHED_PATH, JSON.stringify(arr))
      return
    }
    const old = JSON.parse(readFileSync(process.env.WATCHED_PATH, "utf8"))
    let count = 0
    arr.forEach(el => {
      if (!old.includes(el)) count += 1
    })
    if (count != 0)
      await channel.send({
        embeds: [
          {
            color: 0x5e92d8,
            title: "WOKO Update",
            description: `WOKO posted something new (potentially)`,
            thumbnail: {
              url: "https://www.woko.ch/images/logos/woko-logo.png"
            },
            fields: [
              { name: "Total Ads", value: arr.length, inline: true },
              {
                name: "New Post Count",
                value: count,
                inline: false
              }
            ],
            timestamp: new Date().toISOString()
          }
        ]
      })
    writeFileSync(process.env.WATCHED_PATH, JSON.stringify(arr))
    return
  } catch (error) {
    console.log(error)
  }
}

const job = new CronJob(
  "*/1 * * * *",
  () => {
    checkForUpdates().then(() => 0)
  },
  null,
  false
)

async function execute(interaction) {
  const sub = interaction.options.getSubcommand()
  let len = 0
  switch (sub) {
    case "start":
      job.start()
      writeFileSync(process.env.WATCHED_STATUS_PATH, "1")
      await interaction.reply("Started watching WOKO")
      break
    case "stop":
      job.stop()
      writeFileSync(process.env.WATCHED_STATUS_PATH, "0")
      await interaction.reply("Stopped watching WOKO")
      break
    case "status":
      await interaction.reply(job.running ? "Active!" : "Offline :(")
      break
    case "count":
      if (existsSync(process.env.WATCHED_PATH)) {
        len = JSON.parse(readFileSync(process.env.WATCHED_PATH, "utf8")).length
      }
      await interaction.reply(`${len} ads up`)
      break
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("watch")
    .setDescription(
      "Festus monitors the WOKO website for new vacancies and lets me know!"
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("start")
        .setDescription("Start monitoring the WOKO website")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("stop")
        .setDescription("Stop monitoring the WOKO website")
    )
    .addSubcommand(subcommand =>
      subcommand.setName("status").setDescription("Status of WOKO monitor")
    )
    .addSubcommand(subcommand =>
      subcommand.setName("count").setDescription("Number of active ads on WOKO")
    ),
  execute,
  job
}
