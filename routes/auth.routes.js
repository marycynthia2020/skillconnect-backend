const express = require('express')
const { register, login, logout, refresh } = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refresh)
// router.post('/authenticate', authMiddleware)

module.exports = router