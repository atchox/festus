const router = require("express").Router()

router.get("/", (req, res) => {
  res.send("Festus is too awesome!")
})

router.get("/creators", (req, res) => {
  res.json({
    name: "Atreya Choudhury",
    email: "atreyachoudhury@hotmail.com",
    website: "www.atchox.com"
  })
})

module.exports = { subpath: "/", router: router }
