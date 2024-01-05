const express = require("express");
const router = express.Router();

// Import Function Controller
const { authenticationToken } = require("../middleware/protect.middleware");
const { registerNewUser, loginUser, showDataUser, getEditDataUser, checkToken } = require("../controller/user.controller");

// Router Register
router.post('/register', registerNewUser);

// Router Login
router.post('/login', loginUser);

// Router Get User
router.get("/:id", authenticationToken, showDataUser);

// Route Get Edit User By Id
router.get("/edit-profil/:id", authenticationToken, getEditDataUser);

// Route Check Token
router.get("/check-token", authenticationToken, checkToken);


module.exports = router;
