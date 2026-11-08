const fs = require('fs')

require("dotenv").config()

const db = require("./connect")

const sql = fs.readFileSync(__dirname + '/setup.sql').toString()

db.query(sql)
  .then(data => console.log("Set-up complete."))
  .catch(error => console.log(error))
