/*
** DATA ROUTER **
* REQUEST PATH '/data *
*/

const express = require('express')
const router = express.Router()
const pg = require('../utils/pg')

router.get('/', pg.getUsers)
router.get('/:id', pg.getUserById)
router.post('/', pg.addUser)

module.exports = router