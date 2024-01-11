const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/user.route")
const bodyParser = require("body-parser");
const multer = require('multer');
const upload = multer();
const app = express();
const port = process.env.PORT || 3000;

// For Request body
app.use(express.json());

app.use(bodyParser.json());

app.use(
     bodyParser.urlencoded({
          extended: true
     })
);

// Request form data
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(cors());

// Message Api Uangmu
app.get('/', (req, res) => {
     res.json({
          message: "Welcome To Uangmu"
     });
});

// Route User Register & Login
app.use('/user', userRoute);

// Run Server
app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
});
