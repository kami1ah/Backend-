const { Pool } = require('pg')

require('dotenv').config() // needed when integration testing is done

const db = new Pool({
  connectionString: process.env.NODE_ENV === 'test'
  ? process.env.DB_TEST_URL
  : process.env.DB_URL
})


//ternary 
//condition ? extressionIfTrue: expressionIfFalse
module.exports = db

