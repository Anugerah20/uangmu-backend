const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT env
const secretKey = process.env.JWT_SECRET;

// Controller Register User
const registerNewUser = async (req, res) => {
     const { fullname, email, password } = req.body;

     if (!fullname || !email || !password) {
          return res.status(400).json({
               error: 'All must be filled'
          });
     }

     try {
          const duplicateUser = await prisma.user.findUnique({
               where: { email },
          });

          // Check Email Duplicate
          if (duplicateUser) {
               return res.status(400).json({ error: 'Email already register' });
          }

          // Hash password bcrypt
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Proccess Create New User
          const newUser = await prisma.user.create({
               data: {
                    fullname,
                    email,
                    password: hashedPassword,
               }
          });

          // JWT Token Register User
          const token = jwt.sign({ userId: newUser.id }, secretKey, { expiresIn: '1h' });
          res.json({ message: 'Register Successful', user: newUser, token });

     } catch (error) {
          console.log("Register failed", error)
          res.status(500).json({ error: 'Internal server error' });
     }
}

// Controller Login User
const loginUser = async (req, res) => {
     const { email, password } = req.body;

     if (!email || !password) {
          return res.status(400).json({
               error: 'All must be filled'
          });
     }

     try {
          const checkUser = await prisma.user.findUnique({
               where: { email },
          });

          if (!checkUser) {
               res.status(400).json({ error: 'Wrong email or password' });
          }

          const passwordMatch = await bcrypt.compare(password, checkUser.password);

          if (passwordMatch) {
               // Token JWT Login User
               const token = jwt.sign({ userId: checkUser.id }, secretKey, { expiresIn: '1h' });

               res.json({ message: 'Login successful', checkUser, token });
          } else {
               return res.status(401).json({ error: 'Wrong email or password' });
          }

     } catch (error) {
          console.log("Login failed", error);
          res.status(500).json({ error: 'Internal server error' });
     }
}

// Show Data User
const showDataUser = async (req, res) => {
     const { id } = req.params;
     const newUser = await prisma.user.findUnique({
          where: {
               id,
          },
     });

     if (newUser) {
          res.json({
               id: newUser.id,
               email: newUser.email,
               fullname: newUser.fullname,
          });
     } else {
          res.status(400).json({
               error: "User not found",
          });
     }
}

module.exports = {
     registerNewUser,
     loginUser,
     showDataUser
}