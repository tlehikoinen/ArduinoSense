const logger = require('./logger')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler =  (error, req, res, next) => {
  if (error.code === '23502' || error.code === '23505' || error.name === 'ValidationError') {
    return res.status(400).send(error)
  }
  else if (error.code === '42P01') {
    return res.status(500).send('Table relation error')
  }
  else if (error.name === 'FalseLogin') {
    return res.status(401).json({ error: error.message })
  }
  else {
    return res.status(404).send(error)
  }
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = (request, response, next) => {
  try {
    request.user = jwt.verify(request.token, config.SECRET)
    next()
  } catch(err) {
    response.status(401).send('Invalid token')
  }
}

module.exports = {
  errorHandler,
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  userExtractor
}