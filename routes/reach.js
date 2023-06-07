const router = require("express").Router()
const client = require("../client")

router.post("/reach", async (req, res) => {
  try {
    const channel = await client.channels.fetch(
      `${process.env.REACH_CHANNEL_ID}`
    )
    if (!channel.isTextBased()) {
      console.error(`Not TextBased Channel: ${channel.name}`)
    }
    await channel.send({
      embeds: [
        {
          color: req.body.event === "#0bb533",
          title: "Reach Out",
          description: `Someone reached out on your website`,
          thumbnail: {
            url: "https://atchox.com/192x192.png"
          },
          fields: [
            {
              name: "Name",
              value: req.body.name,
              inline: true
            },
            {
              name: "Email",
              value: req.body.email,
              inline: true
            },
            {
              name: "Message",
              value: req.body.message,
              inline: false
            }
          ],
          timestamp: new Date(req.body.contacted_at).toISOString()
        }
      ]
    })
    return res.status(200).end()
  } catch (err) {
    res.status(500).end()
  }
})

module.exports = { subpath: "/", router: router }
