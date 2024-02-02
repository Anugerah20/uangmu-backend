// const jwt = require("jsonwebtoken");

// const authenticationToken = (req, res, next) => {
//      const token = req.headers["authorization"];

//      if (!token) {
//           console.log("Token Not Found");
//           return res.status(401).json({
//                message: "Unauthorized: Missing Token"
//           });
//      }

//      const splitToken = token.split(' ')[1];

//      try {
//           const resultToken = jwt.verify(splitToken, process.env.JWT_SECRET);

//           if (!resultToken) {
//                return res.status(401).json({
//                     message: "No Authorized"
//                });
//           } else {
//                console.log("Token Verified Successfully");
//                next();
//           }
//      } catch (error) {
//           console.log('Internal server error', error)
//           return res.status(500).json({
//                message: "Internal server error during token verification"
//           });
//      }
// };

// module.exports = {
//      authenticationToken
// }


const jwt = require("jsonwebtoken");

const authenticationToken = (req, res, next) => {
     const token = req.headers["authorization"];

     if (!token) {
          console.log("Token Not Found");
          return res.status(401).json({
               message: "No Token!"
          });
     }

     const splitToken = token.split(' ')[1];

     try {
          const resultToken = jwt.verify(splitToken, process.env.JWT_SECRET);

          if (!resultToken.userId) {
               return res.status(401).json({
                    message: "No Authorized"
               });
          } else {
               console.log("Token Verified Successfully");

               req.user = { id: resultToken.userId };
               next();
          }

     } catch (error) {
          console.log('Server Error', error.message);
          return res.status(500).json({
               message: "Internal server error during token verification"
          });
     }
};

module.exports = {
     authenticationToken
};
