require('dotenv').config()
const { Pool } = require('pg')
const config = require('../config')

const user = require('./user')

const pool = new Pool({
  connectionString: config.POSTGRE_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool