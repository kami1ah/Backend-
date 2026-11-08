const { Pool } = require('pg')
const fs = require('fs')
require('dotenv').config()

//Load SQL reset file 
const resetSQL = fs.readFileSync(__dirname + '/reset.sql').toString()

//Function to reset the test database==so that after a test is run the table emptys and repopulated ready for another test with no changes
const resetTestDB = async () => {
    try { 
        //initialise a new pool instance for the test database connection
        const db = new Pool({
            connectionString: process.env.DB_TEST_URL
        })
        //execute the reset SQL
        await db.query(resetSQL)

        //Close the connection manually
        await db.end()

        console.log('Test DB reset successfully')
    } catch(err) {
        console.log('Could not reset the Test DB', err)

    }
}

module.exports = { resetTestDB }
