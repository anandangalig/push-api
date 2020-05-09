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
    { expiresIn: "90 days" },
  );
};

const generatePasswordResetToken = ({
  _id: userId,
  password: passwordHash,
  createdDate,
  userName,
  email,
}) => {
  const secret = passwordHash + "-" + createdDate;
  const token = jwt.sign({ userId, userName, email }, secret, {
    expiresIn: "3h",
  });
  return token;
};

module.exports = { generateJWT, generatePasswordResetToken };
