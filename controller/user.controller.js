const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT env
const secretKey = process.env.JWT_SECRET;
const cloudinary = require("../config/cloudinary");

// Controller Register User
const registerNewUser = async (req, res) => {
     const { fullname, email, password } = req.body;

     if (!fullname || !email || !password) {
          return res.status(400).json({
               error: "All must be filled"
          });
     }

     try {
          const duplicateUser = await prisma.user.findUnique({
               where: { email },
          });

          // Check Email Duplicate
          if (duplicateUser) {
               return res.status(400).json({ error: "Email already register" });
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
          const token = jwt.sign({ userId: newUser.id }, secretKey, { expiresIn: "1h" });
          res.json({ message: "Register Successful", user: newUser, token });

     } catch (error) {
          console.log("Register failed", error)
          res.status(500).json({ error: "Internal server error", error });
     }
}

// Controller Login User
const loginUser = async (req, res) => {
     const { email, password } = req.body;

     if (!email || !password) {
          return res.status(400).json({
               error: "All must be filled"
          });
     }

     try {
          const checkUser = await prisma.user.findUnique({
               where: { email },
          });

          if (!checkUser) {
               res.status(400).json({ error: "Wrong email or password" });
          }

          const passwordMatch = await bcrypt.compare(password, checkUser.password);

          if (passwordMatch) {
               // Token JWT Login User
               const token = jwt.sign({ userId: checkUser.id }, secretKey, { expiresIn: "1h" });

               res.json({ message: "Login successful", checkUser, token });
          } else {
               return res.status(401).json({ error: "Wrong email or password: ", error });
          }

     } catch (error) {
          console.log("Login failed: ", error);
          res.status(500).json({ error: "Internal server error" });
     }
}

// Check Token
const checkToken = async (req, res) => {
     const { token } = req.body;

     try {
          const decode = jwt.verify(token, process.env.JWT_SECRET);

          // Check user has token
          const user = await prisma.user.findUnique({
               where: {
                    id: decode.userId
               },
          });

          if (user) {
               return res.status(201).json({
                    message: "Token Valid",
               });
          }

     } catch (error) {
          return res.status(401).json({
               message: "Token Invalid",
          });
     }
}

// Show Data User
const showDataUser = async (req, res) => {
     const { id } = req.params;

     try {
          const newUser = await prisma.user.findUnique({
               where: {
                    id,
               },
          });

          if (newUser) {
               res.status(200).json({
                    id: newUser.id,
                    email: newUser.email,
                    fullname: newUser.fullname,
                    bio: newUser.bio,
                    image: newUser.image,
                    joinedAt: newUser.joinedAt
               });
          } else {
               res.status(404).json({
                    error: "User not found",
               });
          }
     } catch (error) {
          console.error("Error in Show Data User:", error);
          res.status(500).json({
               error: "Internal Server Error",
               message: error.message,
          });
     }
}


// Show Data User
// const showDataUser = async (req, res) => {
//      const { id } = req.params;
//      const newUser = await prisma.user.findUnique({
//           where: {
//                id,
//           },
//      });

//      if (newUser) {
//           res.status(201).json({
//                id: newUser.id,
//                email: newUser.email,
//                fullname: newUser.fullname,
//                bio: newUser.bio,
//                image: newUser.image,
//                joinedAt: newUser.joinedAt
//           });

//      } else {
//           res.status(404).json({
//                error: "User not found",
//           });
//      }
// }


// Get Edit User By Id
const getEditDataUser = async (req, res) => {
     const { id } = req.params;

     try {
          const getEditUser = await prisma.user.findUnique({
               where: { id },
               select: {
                    id: true,
                    fullname: true,
                    email: true,
                    bio: true,
                    image: true
               }
          });

          if (!getEditUser) {
               return res.status(404).json({
                    message: "User not found",
               });
          }

          res.json(getEditUser);

     } catch (error) {
          console.log("Get Edit Data User By id Failed: ", error);
          res.status(500).json({
               message: "Internal server error",
          });
     }
}

// Uploads an image file
const uploadImage = async (imagePath) => {
     const options = {
          unique_filename: false,
          overwrite: false,
          folder: "user-uangmu"
     };

     try {
          // Upload the image
          const result = await cloudinary.uploader.upload(imagePath, options);
          return result.secure_url;

     } catch (error) {
          console.error("Erro Uploading Image: ", error.message);
     }
};

// Edit Data User By Id
const editDataUserById = async (req, res) => {
     const { id } = req.params;
     const { fullname, bio } = req.body;
     let imageUrl = "";

     console.log(req.body);

     try {
          if (req.file) {
               // Use buffers from files to create URI data
               const b64 = Buffer.from(req.file.buffer).toString("base64");
               const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

               // Upload Image Cloudinary
               imageUrl = await uploadImage(dataURI);
               // console.log("Image URL: ", imageUrl);
          }

     } catch (error) {
          console.log(error.message);
     }

     try {
          const editDataUser = await prisma.user.update({
               where: { id },
               data: {
                    fullname,
                    bio,
                    image: imageUrl
               }
          });

          if (!editDataUser) {
               return res.status(404).json({
                    message: "User not found",
               });
          }

          res.status(200).json({
               message: "User Data Updated Successfully",
               editDataUser
          });

     } catch (error) {
          console.log("Edit Data User By id Failed: ", error);
          res.status(500).json({
               message: "Internal server error",
          });
     }
}

module.exports = {
     registerNewUser,
     loginUser,
     showDataUser,
     getEditDataUser,
     checkToken,
     editDataUserById
}