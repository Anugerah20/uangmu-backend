const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Fungsi untuk membuat kirim pesan kontak
const sendContact = async (req, res) => {
     let { fullname, email, message } = req.body;

     const userId = req.user.id;

     try {
          // Buat kondisi jika fullname, email, dan message tidak diisi
          if (fullname === '' || email === '' || message === '') {
               return res.status(400).json({ error: 'Please fill in the data' });
          }

          const contact = await prisma.contact.create({
               data: {
                    fullname,
                    email,
                    message,
                    userId
               }
          });

          res.status(201).json({ contact, message: 'Success send contact' });

     } catch (error) {
          res.status(400).json({ error: 'Failed send contact message' });
     }
}

// Fungsi untuk menampilkan semua pesan kontak
const showAllContact = async (req, res) => {
     const { userId } = req.params;

     try {
          const showContact = await prisma.contact.findMany({
               where: {
                    userId
               }
          });

          if (!showContact || showContact.length === 0) {
               throw new Error('UserId Not Found');
          }

          res.status(200).json({
               message: 'Success show all contact',
               showContact
          });

     } catch (error) {
          res.status(400).json({ error: 'Failed show contact message' });
     }
}

module.exports = {
     sendContact,
     showAllContact,
}