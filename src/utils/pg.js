require('dotenv').config()
const { Pool } = require('pg')
const config = require('./config')

const pool = new Pool({
  connectionString: config.POSTGRE_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

const getUsers = (req, res) => {
  pool.query('SELECT * from person;', (err, results) => {
    if (err) {
      throw err
    }
    res.status(200).json(results.rows)
  })
}

const getUserById = (req, res) => {
  const id = req.params.id
  pool.query('SELECT first_name from person WHERE first_name = $1;', [id], (err, results) => {
    if (err) {
      throw (err)
    }
    res.status(200).json(results.rows)
  })
}

const addUser = (req, res) => {
  const first_name = req.body.first_name
  const last_name = req.body.last_name
  const gender = req.body.gender
  const date_of_birth = req.body.date_of_birth

  pool.query('INSERT INTO person (first_name, last_name, gender, date_of_birth) VALUES ($1, $2, $3, $4);', [first_name, last_name, gender, date_of_birth], (err, result) => {
    if (err) {
      throw (err)
    }
    res.status(200).json(result)

  })
}

module.exports = { getUserById, getUsers, addUser }