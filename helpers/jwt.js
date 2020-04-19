const jwt = require("jsonwebtoken");

const generateJWT = ({ _id, userName, email }) => {
  return jwt.sign(
    {
      data: {
        _id,
        userName,
        email,
      },
    },
    process.env.JWT_SIGNATURE,
    { expiresIn: "6h" },
  );
};

module.exports = generateJWT;
