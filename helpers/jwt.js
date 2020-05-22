const jwt = require("jsonwebtoken");

const generateJWT = ({ _id, email }) => {
  return jwt.sign(
    {
      data: {
        _id,
        email,
      },
    },
    process.env.JWT_SIGNATURE,
    { expiresIn: "90 days" },
  );
};

const generatePasswordResetToken = ({
  _id: userId,
  password: passwordHash,
  createdDate,
  email,
}) => {
  const secret = passwordHash + "-" + createdDate;
  const token = jwt.sign({ userId, email }, secret, {
    expiresIn: "3h",
  });
  return token;
};

module.exports = { generateJWT, generatePasswordResetToken };
