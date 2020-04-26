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

const generatePasswordResetToken = ({ _id: userId, password: passwordHash, createdDate }) => {
  const secret = passwordHash + "-" + createdDate;
  const token = jwt.sign({ userId }, secret, {
    expiresIn: 3600,
  });
  return token;
};

module.exports = { generateJWT, generatePasswordResetToken };
