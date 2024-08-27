const express = require('express');
const router = express.Router();

const { authenticationToken } = require('../middleware/protect.middleware');

const { sendContact, showAllContact } = require('../controller/contact.controller');

// Route Create Note
router.post('/contact', authenticationToken, sendContact);

// Route Show all contact
router.get('/contact/:userId', authenticationToken, showAllContact);

module.exports = router;