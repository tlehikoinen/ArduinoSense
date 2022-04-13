/*
** DATA ROUTER **
* REQUEST PATH '/data *
*/

const express = require('express')
const dataRouter = express.Router()
const data = require('../utils/postgres/data')
const middleware = require('../utils/middleware')

dataRouter.post('/initialise', data.initialiseDataTable)
dataRouter.get('/:username', data.getDataByUsername)
dataRouter.get('/', data.getData)
dataRouter.post('/', middleware.userExtractor, data.postData)

module.exports = dataRouter