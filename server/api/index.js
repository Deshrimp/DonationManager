var express = require("express")
var router = express.Router()

var db = require("../models")

//returns true if we are working with an authorized user
function validateCookies(signedCookies) {
  // TODO: change the logic of this if statement to reflect our login system
  if (signedCookies) {
    //check that we are dealing with a real user

    return true
  } else {
    return false
  }
}

router.post("/api/login", async (req, res) => {
  const { username, password } = req.body
  const center = await db.centers.findOne({
    attributes: ["password"],
    where: { rfc: username }
  })

  if (!center) {
    //if we get a null result, the user failed to login because the username doesnt exist
    res.status(401).send({ error: true, message: "Invalid password" })
  } else {
    const { password: dbPassword } = center.dataValues
    if (password === dbPassword) {
      res.cookie("username", username)
      res.status(200).send({ error: false, message: "Login successful" })
    } else {
      res.status(401).send({ error: true, message: "Invalid password" })
    }
  }
})

// The api endpoints /api/centers/create
router.post("/api/centers/create", function(req, res) {
  console.log("Accesed centers/create")
  var r = req.body

  const {
    name,
    street,
    colonia,
    delegacion,
    cp,
    state,
    phone,
    cause,
    description,
    schedule,
    password,
    responsible,
    city,
    email,
    rfc
  } = req.body
  //do validation of all of the above values
  if (!name) {
    res.status(400).send({ message: "You must enter a name.", error: true })
    return
  } else if (!street) {
    res
      .status(400)
      .send({ message: "You must enter a street address.", error: true })
    return
  }
  db.centers
    .create({
      name,
      street,
      colonia,
      delegacion,
      cp,
      state,
      phone,
      cause,
      description,
      schedule,
      rfc,
      email,
      city,
      responsible,
      password
    })
    .then(
      res.status(200).send({ message: "Registration succesful", error: false })
    )
    .catch(error => {
      res.status(400).send({
        message: "Failed to create new center.",
        error: true,
        data: error
      })
    })
})

module.exports = router
