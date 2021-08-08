const { login, registration, allUser } = require('../Controllers/UserController');

const router = require('express').Router();

//registration route
router.post('/register', registration)

//login route
router.post('/login',login)

//all user
router.get('/', allUser)

module.exports = router;