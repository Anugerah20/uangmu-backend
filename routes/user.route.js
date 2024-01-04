const express = require("express");
const router = express.Router();

// Import Function Controller
const { authenticationToken } = require("../middleware/protect.middleware");
const { registerNewUser, loginUser, showDataUser } = require("../controller/user.controller");

// Router Register
router.post('/register', registerNewUser);

// Router Login
router.post('/login', loginUser);

// Router Get User
router.get("/:id", authenticationToken, showDataUser);

module.exports = router;
