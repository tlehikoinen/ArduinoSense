require('dotenv').config()
const express = require('express')
const path = require('path');
const middleware = require('./utils/middleware')
const bodyParser = require('body-parser')

const dataRouter = require('./routes/user.js')


const app = express()

app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html/index.html'))
})

app.use('/user', dataRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

console.log('hei')
module.exports = app