var express = require("express")
var router = express.Router()

var db = require("../models")

//returns true if we are working with an authorized user
async function validateCookies(username, signedCookies) {
  // first check that they have this signed cookie
  if (signedCookies.session) {
    //check that the password is correct
    const password = await retrievePassword(username)
    if (signedCookies.session === password) {
      return true
    }
  }
  return false
}
//returns the password for a given user
async function retrievePassword(username) {
  const center = await db.centers.findOne({
    attributes: ["password"],
    where: { rfc: username }
  })
  if (center) {
    return center.dataValues.password
  } else {
    return null
  }
}

router.post("/api/login", async (req, res) => {
  const { username, password } = req.body
  const dbPassword = await retrievePassword(username)
  if (!dbPassword) {
    //if we get a null result, the user failed to login because the username doesnt exist
    res.status(401).send({ error: true, message: "Invalid password" })
  } else {
    if (password === dbPassword) {
      res.cookie("username", username)
      res.cookie("session", password, { signed: true })
      res.status(200).send({ error: false, message: "Login successful" })
    } else {
      res.status(401).send({ error: true, message: "Invalid password" })
    }
  }
})

// The api endpoints /api/items/add
router.post("/api/items/add", async (req, res) => {
  const { name, category, specifications, quantity } = req.body
  const { username } = req.cookies
  const { signedCookies } = req
  console.log( signedCookies, username)
  //first we need to validate that the person making this request
  // to add an item is actually logged in
  const authorized = await validateCookies(username, signedCookies)
  if (authorized) {
    //now that we verified they are logged in
    // we can add the item to the database
    await db.items.create({
      name,
      category,
      specifications,
      quantity,
      rfc: username
    })
    res.sendStatus(200)
  } else {
    res.status(401).send({ error: true, message: "Not logged in" })
  }
})
// this endpoint deletes a single item
router.delete("/api/items/:id", async (req, res) => {
  // first we must validate that they're the signed in user
  const {
    signedCookies,
    cookies: { username }
  } = req
  const authorized = await validateCookies(username, signedCookies)
  if (authorized) {
    const { id } = req.params
    const dbres = await db.items.destroy({ where: { id } })
    if (dbres === 1) {
      res
        .status(200)
        .send({ message: "Item successfully deleted", error: false })
    } else {
      res.status(400).send({ error: true, message: "Problem deleting item" })
    }
  } else {
    res.status(401).send({ error: true, messsage: "Not logged in" })
  }
})

// This endpoint allows the user to update a single item
router.patch("/api/items/:id", async (req, res) => {
  // first we must validate that they're the signed in user
  const {
    signedCookies,
    cookies: { username }
  } = req
  const authorized = await validateCookies(username, signedCookies)
  if (authorized) {
    // get our data out of the request
    const { name, quantity, specifications, category } = req.body
    const { id } = req.params
    // update the item in the database
    const dbRes = await db.items.update(
      { name, quantity, specifications, category },
      { where: { id } }
    )
    res
      .status(200)
      .send({ message: "Successfully updated " + name, error: false })
  } else {
    res.status(401).send({ error: true, messsage: "Not logged in" })
  }
})

//public version of items api endpoint, no authorization required

router.get("/api/items/:id", async (req, res) => {
  try{const { id } = req.params
  let items = await db.items.findAll({ where: { rfc: id } })
  items = items.map(
    ({ dataValues: { id, name, category, quantity, specifications } }) => ({
      id,
      name,
      category,
      quantity,
      specifications
    })
  )
  res.status(200).send(items)
}catch(err){
  res.status(400).send(err)
}})

// This endpoint returns all of the items for a user
router.get("/api/items", async (req, res) => {
  const {
    signedCookies,
    cookies: { username }
  } = req
  const authorized = await validateCookies(username, signedCookies)
  //only send back the items if they're authorized
  if (authorized) {
    let items = await db.items.findAll({ where: { rfc: username } })
    items = items.map(
      ({ dataValues: { id, name, category, quantity, specifications } }) => ({
        id,
        name,
        category,
        quantity,
        specifications
      })
    )
    res.status(200).send(items)
  } else {
    res.status(401).send({ error: true, message: "Not logged in" })
  }
})

//Retrieve lat/lng of all centers
router.get("/api/centers", async (req, res) => {
  let centers = await db.centers.findAll()
  centers = centers.map(({ dataValues: { rfc: id, name, lat, lng } }) => ({
    id,
    name,
    lat,
    lng
  }))
  res.status(200).send(centers)

  /*db.centers.findAll().then(function(centers) {
    let centersAddress = centers.map(function(centers, index) {
      let address = []
      let name = centers.dataValues.name
      let street = centers.dataValues.street
      let colonia = centers.dataValues.colonia
      let delegacion = centers.dataValues.delegacion
      let city = centers.dataValues.city
      let phone = centers.dataValues.phone
      let cause = centers.dataValues.cause
      address.push(street, colonia, delegacion, city)
    })

    res.send(centersAddress)
    console.log(centersAddress)
  })*/
})

// The api endpoints /api/centers/create
router.post("/api/centers/create", function(req, res) {
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
    rfc,
    website,
    lat,
    lng
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
    .create(req.body)
    .then(r => {
      res.cookie("username", rfc)
      res.cookie("session", password, { signed: true })
      res.status(200).send({ message: "Registration succesful", error: false })
    })
    .catch(error => {
      res.status(400).send({
        message: "Failed to create new center.",
        error: true,
        data: error
      })
    })
})

module.exports = router
