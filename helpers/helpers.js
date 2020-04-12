const jwt = require("jsonwebtoken");

const generateJWT = ({ insertedId, userName, email }) => {
  return jwt.sign(
    {
      data: {
        _id: insertedId,
        userName,
        email,
      },
    },
    process.env.JWT_SIGNATURE,
    { expiresIn: "6h" },
  );
};

module.exports = generateJWT;
