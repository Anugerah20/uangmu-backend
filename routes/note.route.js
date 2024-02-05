const express = require('express');
const router = express.Router();

const { authenticationToken } = require('../middleware/protect.middleware');

const { createNote, getNoteById, editNoteById, deleteNoteById } = require('../controller/note.controller');

// Route Create Note
router.post('/note', authenticationToken, createNote);

// Route Show Note By ID
router.get('/get-note/:userId', getNoteById);

// Route Edit Note By ID
router.put('/edit-note/:userId', authenticationToken, editNoteById);

// Route Delete Note By ID
router.delete('/delete-note/:userId', deleteNoteById);

module.exports = router;
