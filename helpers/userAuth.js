const argon2 = require("argon2");
const { randomBytes } = require("crypto");
const { isNil } = require("ramda");
const { generateJWT, generatePasswordResetToken } = require("./jwt");
const getMongoConnection = require("./mongoConnect");
const nodemailer = require("nodemailer");

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
  console.log(token);

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
      html: `<h1>Hello there!</h1><p>That was easy!</p><p>http://localhost.com?token=${token}</p>`,
    },
    (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).end("Email was could not be sent");
      } else {
        console.log("Email sent: " + info.response);
        res.send(`Password reset link has been sent to ${req.body.email}`);
      }
    },
  );
};

module.exports = {
  userSignUp,
  userLogin,
  forgotPassword,
};
