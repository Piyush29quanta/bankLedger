const express = require('express');
const { registerUser,loginUser,userLogoutController} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post("/logout",userLogoutController)

module.exports = router;