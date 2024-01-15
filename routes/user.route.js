const express = require("express");
const router = express.Router();
const Multer = require("multer");

// Import Function Controller
const { authenticationToken } = require("../middleware/protect.middleware");
const { registerNewUser, loginUser, showDataUser, getEditDataUser, checkToken, editDataUserById } = require("../controller/user.controller");

// Multer Upload Image
const storage = new Multer.memoryStorage();
const upload = Multer({
     storage,
})

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

// Route Edit Profile User
router.put("/edit-profil/:id", authenticationToken, upload.single("file"), editDataUserById);

module.exports = router;
