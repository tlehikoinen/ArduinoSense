/*
** USER ROUTER **
* REQUEST PATH '/user *
*/

const express = require('express')
const router = express.Router()
const user = require('../utils/postgres/user')

router.get('/:id', user.getUserById)
router.post('/login', user.loginUser)
router.post('/initialise', user.initialiseUserTable)
router.get('/', user.getUsers)
router.post('/', user.addUser)


module.exports = router