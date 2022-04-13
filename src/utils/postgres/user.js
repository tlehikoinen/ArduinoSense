const pool = require('./pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

const saltRounds = 10

const initialiseUserTable = (req, res, next) => {
  pool.query('\
  CREATE TABLE IF NOT EXISTS users (\
  id SERIAL PRIMARY KEY, \
  username VARCHAR NOT NULL UNIQUE,\
  password VARCHAR NOT NULL);',
    (err, results) => {
      if (err) {
        next(err)
      } else {
        res.status(200).json(results)
      }
    })
}

const getUsers = (req, res, next) => {
    pool.query('SELECT * from users;', (err, results) => {
      if (err) {
        next(err)
      } else {
        res.status(200).json(results.rows)
      }
    })
}

const getUserById = (req, res, next) => {
  const id = req.params.id

  pool.query('SELECT * from users WHERE id = $1;', [id], (err, results) => {
    if (err) {
      next(err)
    } else {
      if (results.rows.length === 0) {
        res.status(404).send('User does not exist')
      } else {
        res.status(200).json(results.rows)
      }
    }
  })
}

const addUser = async (req, res, next) => {
  const first_name = req.body.username

  if ( !req.body.password || req.body.password === undefined || req.body.password.length < 8) {
    const error = { name: 'ValidationError', message: 'Password must have 8 characters' }
    return next(error)
  }

  const hashPassword = await bcrypt.hash(req.body.password, saltRounds)

  pool.query('INSERT INTO users (username, password) VALUES ($1, $2);', [first_name, hashPassword], (err, result) => {

    if (err) {
      next(err)
    } else {
      res.status(200).json(result)
    }
  })
}

const loginUser = (req, res, next) => {
  pool.query('SELECT * from users WHERE username = $1;', [req.body.username], async (err, results) => {
    if (err) {
      next(err)
    } else {
      const correctPassword = results.rows.length === 0
        ? false 
        : await bcrypt.compare(req.body.password, results.rows[0].password)

      if (!correctPassword) {
        const error = { name: 'FalseLogin', message: 'Wrong username or password'}
        return next(error)
      }

      const userForToken = {
        username: results.rows[0].username,
        id: results.rows[0].id
      }
      const token = jwt.sign(userForToken, config.SECRET)
      res.status(200).send(token)

    }
  })
}

module.exports = { addUser, loginUser, getUserById, getUsers, initialiseUserTable }