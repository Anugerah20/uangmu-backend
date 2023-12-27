const express = require("express");
const router = express.Router();

// Import Function Controller
const { registerNewUser, loginUser } = require("../controller/user.controller");

// Router Register
router.post('/register', registerNewUser);

// Router Login
router.post('/login', loginUser);

module.exports = router;
