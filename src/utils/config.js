const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
  path: path.join(__dirname,'../.env'),
})

const PORT = process.env.PORT || 5000
const POSTGRE_URI=process.env.POSTGRE_URI

module.exports = {
  PORT,
  POSTGRE_URI
}

