const pool = require('./pg')
const bcrypt = require('bcrypt')
const config = require('../config')
const { response } = require('../../app')

const initialiseDataTable = (req, res, next) => {
  console.log('initialise')
  pool.query('\
  CREATE TABLE IF NOT EXISTS data (\
  id SERIAL PRIMARY KEY, \
  user_id INT,\
  temperature VARCHAR NOT NULL,\
  humidity VARCHAR NOT NULL,\
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id));',
    (err, results) => {
      if (err) {
        console.log(err)
        next(err)
      } else {
        res.status(200).json(results)
      }
    })
}

const getData = (req, res, next) => {
  pool.query('\
  SELECT * from data;', (err, results) => {
    if (err) {
      next(err)
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const getDataByUsername = (req, res, next) => {
  const username = req.params.username
  const username2 = req.query
  console.log(username)
  console.log(username2)
  pool.query('\
  SELECT D.* from data D JOIN users U ON U.id = D.user_id WHERE U.username=$1;',
  [username], (err, results) => {
    if (err) {
      next(err)
    } else {
      res.status(200).json(results.rows)
    }
  })
}

const postData = (req, res, next) => {
  const temperature = req.body.temperature
  const humidity = req.body.humidity
  const userId = req.user.id
  pool.query('\
  INSERT INTO data (user_id, temperature, humidity) \
  VALUES ($1, $2, $3);', [userId, temperature, humidity], (err, results) => {
    if (err) {
      console.log(err)
      next(err)
    } else {
      res.status(200).send('Post successful')
    }
  })
}


module.exports = { getData, getDataByUsername, initialiseDataTable, postData }