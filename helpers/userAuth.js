const argon2 = require("argon2");
const { randomBytes } = require("crypto");
const { isNil } = require("ramda");
const { generateJWT, generatePasswordResetToken } = require("./jwt");
const getMongoConnection = require("./mongoConnect");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const userSignUp = async (req, res) => {
  const { userName, password, email } = req.body;
  if ([userName, password, email].some((each) => isNil(each))) {
    res.status(400).end("All fields need to be sent with request");
  }
  const salt = randomBytes(32);
  const passwordHashed = await argon2.hash(password, { salt }); //https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback

  const mongoConnection = await getMongoConnection();
  const { insertedId } = await mongoConnection.db("push").collection("users").insertOne({
    userName,
    email,
    password: passwordHashed,
    salt,
    createdDate: new Date().toISOString(),
  });

  const token = insertedId ? generateJWT({ _id: insertedId, userName, email }) : null;

  res.send({
    token,
    email,
    userName,
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const mongoConnection = await getMongoConnection();
  const userRecord = await mongoConnection.db("push").collection("users").findOne({ email });

  if (!userRecord) {
    res.status(404).end("User Not Found");
  } else {
    const correctPassword = await argon2.verify(userRecord.password, password);
    if (!correctPassword) {
      res.status(401).end("Incorrect Password");
    }
  }

  const token = userRecord ? generateJWT(userRecord) : null;

  res.send({
    token,
    email,
    userName: userRecord.userName,
  });
};

const forgotPassword = async (req, res) => {
  //1. check for email, return No email found if not found
  const mongoConnection = await getMongoConnection();
  const userRecord = await mongoConnection
    .db("push")
    .collection("users")
    .findOne({ email: req.body.email });

  if (!userRecord) {
    res.status(404).end("Email Not Found");
  }

  //2. if email is found, generate JWT:
  const token = userRecord ? generatePasswordResetToken(userRecord) : null;

  //3.send that email:
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  transporter.sendMail(
    {
      from: "hello.xyzapp@gmail.com",
      to: "anandangalig@gmail.com",
      subject: "Message",
      date: new Date(),
      html: `
      <p>Hey ${userRecord.userName},</p>
      <p>Good news! We processed your request to reset your password.</p>
      <p>Please click on the following link to create a new one. This one time use link will expire in one hour.</p>
      <p>${process.env.API_URL}/reset-password?uid=${userRecord._id}&token=${token}</p>
      <p>Best regards,<br>Push Pirates.</p>`,
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).end("Email could not be sent");
      } else {
        console.log("Email sent: " + info.response);
        res.send(`Password reset link has been sent to ${req.body.email}`);
      }
    },
  );
};

const resetPassword = async (req, res) => {
  const { newPassword, newPasswordConfirm } = req.body;
  const { token, uid } = req.query;
  if (newPassword !== newPasswordConfirm) {
    res.status(400).end("The two input values did not match");
  }
  if (!token || !uid) {
    res.status(400).end("One time use token or uid missing from request");
  }
  const mongoConnection = await getMongoConnection();
  const userRecord = await mongoConnection
    .db("push")
    .collection("users")
    .findOne({ _id: ObjectId(uid) });

  if (!userRecord) {
    res.status(404).end("User Not Found");
  }
  const secret = userRecord.password + "-" + userRecord.createdDate;

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      console.error(err);
      res.status(401).end(err.message);
    } else {
      const { userId, email, userName } = decoded;
      const salt = randomBytes(32);
      const passwordHashed = await argon2.hash(newPassword, { salt });
      const { matchedCount, modifiedCount } = await mongoConnection
        .db("push")
        .collection("users")
        .updateOne(
          { _id: ObjectId(userId), email, userName },
          { $set: { password: passwordHashed, salt: salt } },
        );
      if (matchedCount && modifiedCount) {
        res.send("Your password has been reset successfully!");
      }
    }
  });
};

module.exports = {
  userSignUp,
  userLogin,
  forgotPassword,
  resetPassword,
};
