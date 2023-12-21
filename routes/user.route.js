const express = require("express");
const router = express.Router();

// Import Function Controller
const { registerNewUser } = require("../controller/user.controller");

// Router Register
router.post('/register', registerNewUser);

// Router Login
// router.post('/login', nameController);

module.exports = router;
