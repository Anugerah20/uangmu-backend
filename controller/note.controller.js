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

// Menampilkan semua catatan
const getAllNote = async (req, res) => {
     const { userId } = req.params;

     try {
          const showAllNotes = await prisma.note.findMany({
               where: {
                    userId
               }
          });

          // Kondisi jika All Notes tidak ditemukan berdasarkan userId
          if (!getAllNote || getAllNote.length === 0) {
               throw new Error('UserId Not Found');
          }

          res.status(201).json({
               showAllNotes,
               message: 'Success show all notes'
          });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal Server Error' });
     }
}


// Menampilkan catatan bedasarkan ID User
const getNoteById = async (req, res) => {
     // Proses membuat pagination di note controller
     const { userId } = req.params;

     let { page = 1, limit = 2 } = req.query;

     try {
          // Menghitung jumlah data note berdasarkan userId
          // skip untuk melewati data
          const skip = (page - 1) * limit;

          // Take buat menampilkan data
          const take = parseInt(limit);

          // Menampilkan data note berdasarkan userId dengan pagination
          const showNotes = await prisma.note.findMany({
               where: {
                    userId,
               },
               skip,
               take,
               orderBy: {
                    id: 'desc'
               }
          });

          // Kondisi jika showNotes tidak ditemukan berdasarkan userId
          if (!showNotes || showNotes.length === 0) {
               throw new Error('UserId Not Found');
          }

          // Menghitung total catatan untuk userId tertentu
          const totalNotes = await prisma.note.count({
               where: {
                    userId,
               },
          });

          // Menghitung total halaman yang ada
          totalPages = Math.ceil(totalNotes / limit)

          // Mengubah currentPage menjadi bilangan integer
          currentPage = parseInt(page)

          res.status(201).json({
               showNotes,
               totalPages,
               currentPage,
               message: 'Success show note by id'
          });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal Server Error' });
     }
}

// Edit Catatan Bedasarkan ID User
// const editNoteById = async (req, res) => {
// const { userId, id } = req.params;
//      const { userId } = req.params;

// console.log("ID ID: ", id);

//      const { description, date, price, noteType } = req.body;

//      try {
//           const CheckUserId = await prisma.note.findFirst({
//                where: {
//                     userId
// id
//                },
//           });
//           console.log(CheckUserId);

// Check Note By ID
//           if (!CheckUserId) {
// throw Error('UserId Not Found');
//                throw Error('ID Not Found');
//           }

//           const editNote = await prisma.note.update({
//                where: {
//                     id: CheckUserId.id
// id
//                },
//                data: {
//                     description,
//                     date,
//                     price,
//                     noteType
//                }
//           });

//           if (!editNote) {
//                return res.status(401).json({
//                     error: 'Edit Note Failed'
//                });
//           }

// Check User ID
//           if (editNote.userId !== userId) {
//                return res.status(401).json({ error: 'Unauthorized: user id no match' });
//           }

//           res.status(201).json({
//                editNote,
//                message: 'Edit Note Success'
//           });

//      } catch (error) {
//           console.log(error);
//           res.status(500).json({ error: 'Internal server error' });
//      }
// }

const editNoteById = async (req, res) => {
     const { userId, id } = req.params;

     const { description, date, price, noteType } = req.body;

     try {
          // Cek catatan berdasarkan userId dan id
          const note = await prisma.note.findFirst({
               where: {
                    userId,
                    id
               },
          });

          if (!note) {
               throw Error('ID Not Found');
          }

          const editNote = await prisma.note.update({
               where: {
                    id: note.id
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

          // Check User ID
          if (editNote.userId !== userId) {
               return res.status(401).json({ error: 'Unauthorized: user id no match' });
          }

          res.status(201).json({
               editNote,
               message: 'Edit Note Success'
          });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal server error' });
     }
}


const deleteNoteById = async (req, res) => {
     const { userId } = req.params;

     try {
          const checkUserId = await prisma.note.findFirst({
               where: {
                    userId
               }
          });

          // Cek apakah userId ada atau tidak
          if (!checkUserId) {
               throw Error('UserId Not Found');
          }

          const deleteNote = await prisma.note.delete({
               where: {
                    id: checkUserId.id
               }
          });

          return res.status(201).json({
               deleteNote,
               message: 'Delete Note Success'
          });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal server error' });
     }
}

module.exports = {
     createNote,
     getNoteById,
     editNoteById,
     deleteNoteById,
     getAllNote
}