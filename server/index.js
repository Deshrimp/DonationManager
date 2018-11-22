const express = require("express")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// bring in the models
let db = require("./models")

let app = express()

// we'll use this later
// Serve static content for the app from the "public" directory in the application directory.
//app.use(express.static("public"))

//parse cookie information from requests
const cookieParser = require("cookie-parser")
app.use(cookieParser(process.env.COOKIE_SECRET))

// Parse request body as JSON
app.use(express.json())
const api = require("./api")

app.use(api)

// listen on port 9000
const PORT = process.env.PORT || 9000
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT)
  })
})
