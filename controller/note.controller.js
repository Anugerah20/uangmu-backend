const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Membuat catatan baru
const createNote = async (req, res) => {
     let { description, date, price, noteType } = req.body;
     price = parseInt(price);

     const userId = req.user.id;

     try {
          const note = await prisma.note.create({
               data: {
                    description,
                    date,
                    price,
                    noteType,
                    userId
               }
          });

          res.status(201).json({ note, message: 'Success create note' });

     } catch (error) {
          console.log(error);
          res.status(401).json({ error: 'Failed create note' });
     }
}

// Menampilkan catatan bedasarkan ID
const getNoteById = async (req, res) => {
     const { userId } = req.params;

     try {
          const showNotes = await prisma.note.findFirst({
               where: {
                    userId
               }
          });

          if (!showNotes) {
               return res.status(404).json({
                    message: 'User ID Not Found'
               });
          }

          res.status(201).json({
               showNotes,
               message: 'Success show note by id'
          });

     } catch (error) {
          console.log(error)
          res.status(500).json({ error: 'Internal Server Error' });
     }
}

// Edit Catatan Bedasarkan ID User
const editNoteById = async (req, res) => {
     const { userId } = req.params;

     const { description, date, price, noteType } = req.body;

     try {
          const CheckUserId = await prisma.note.findFirst({
               where: {
                    userId
               },
          });
          console.log(CheckUserId);

          // Check Note By ID
          if (!CheckUserId) {
               return res.status(404).json({
                    error: 'UserId Not Found'
               });
          }

          const editNote = await prisma.note.update({
               where: {
                    id: CheckUserId.id
               },
               data: {
                    description,
                    date,
                    price,
                    noteType
               }
          });

          if (!editNote) {
               return res.status(401).json({
                    error: 'Edit Note Failed'
               });
          }

          res.status(201).json({
               editNote,
               message: 'Edit Note Success'
          });

     } catch (error) {
          console.log(error)
          res.status(500).json({ error: 'Internal server error' });
     }
}

module.exports = {
     createNote,
     getNoteById,
     editNoteById,
}
