require('dotenv').config()
const express = require('express')
const middleware = require('./utils/middleware')
const bodyParser = require('body-parser')

const dataRouter = require('./routes/data.js')

const app = express()

app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/data', dataRouter)

app.use(middleware.unknownEndpoint)

module.exports = app