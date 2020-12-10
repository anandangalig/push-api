const argon2 = require("argon2");
const { randomBytes } = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { isNil } = require("ramda");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const path = require("path");

const getMongoConnection = require("./mongoConnect");
const { generateJWT, generatePasswordResetToken } = require("./jwt");

const userSignUp = async (req, res) => {
  const { password, email } = req.body;
  if ([password, email].some((each) => isNil(each))) {
    res.status(400).end("Password and email fields are required");
    return;
  }

  const mongoConnection = await getMongoConnection();
  const emailAlreadyExists = await mongoConnection
    .db("push")
    .collection("users")
    .findOne({ email });

  if (emailAlreadyExists) {
    res
      .status(401)
      .end(
        `${email} is already registered to a user. If you forgot your password, please reset it from the app.`,
      );
    return;
  }

  const salt = randomBytes(32);
  const passwordHashed = await argon2.hash(password, { salt }); //https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
  const { insertedId } = await mongoConnection.db("push").collection("users").insertOne({
    email,
    password: passwordHashed,
    salt,
    createdDate: new Date().toISOString(),
  });

  const token = insertedId ? generateJWT({ _id: insertedId, email }) : null;

  res.send({
    token,
    email,
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
      return;
    }

    const token = userRecord ? generateJWT(userRecord) : null;
    res.send({
      token,
      email,
    });
  }
};

const oAuthSignIn = async ({ oAuthType, token }, res) => {
  switch (oAuthType) {
    case "google": {
      try {
        const client = new OAuth2Client(process.env.GOOGLE_OATH_CLIENT_ID);
        const verify = async () => {
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_OATH_CLIENT_ID,
          });
          return ticket.getPayload();
        };

        const { email, email_verified, exp } = await verify().catch(console.error);
        const currentTimestampInSeconds = Date.now() / 1000;

        if (email_verified && exp > currentTimestampInSeconds) {
          const mongoConnection = await getMongoConnection();
          const userRecord = await mongoConnection
            .db("push")
            .collection("users")
            .findOne({ email });

          if (userRecord) {
            res.send({
              token: generateJWT(userRecord),
              email,
            });
          } else {
            const { insertedId } = await mongoConnection.db("push").collection("users").insertOne({
              email,
              createdDate: new Date().toISOString(),
            });
            res.send({
              token: generateJWT({ _id: insertedId, email }),
              email,
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
      break;
    }
    default:
      res.status(400).end("oAuth Sign In could not be completed");
      break;
  }
};

const forgotPassword = async (req, res) => {
  const mongoConnection = await getMongoConnection();
  const userRecord = await mongoConnection
    .db("push")
    .collection("users")
    .findOne({ email: req.body.email });

  if (!userRecord) {
    res.status(404).end("Email Not Found");
    return;
  }

  const token = userRecord ? generatePasswordResetToken(userRecord) : null;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  transporter.sendMail(
    {
      from: "hello.xyzapp@gmail.com",
      to: `${req.body.email}`,
      subject: "Push Pirates password reset request",
      date: new Date(),
      html: `
      <p>Hey friend,</p>
      <p>Good news! We processed your request to reset your password.</p>
      <p>Please click on the following link to create a new one. This one time use link will self-destruct in three hours.</p>
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
    return;
  }
  if (!token || !uid) {
    res.status(400).end("One time use token or uid missing from request");
    return;
  }

  const mongoConnection = await getMongoConnection();
  const userRecord = await mongoConnection
    .db("push")
    .collection("users")
    .findOne({ _id: ObjectId(uid) });

  if (!userRecord) {
    res.status(404).end("User Not Found");
    return;
  }

  const secret = userRecord.password + "-" + userRecord.createdDate;
  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      console.error(err);
      res.status(401).end(err.message);
    } else {
      const { userId, email } = decoded;
      const salt = randomBytes(32);
      const passwordHashed = await argon2.hash(newPassword, { salt });
      const { matchedCount, modifiedCount } = await mongoConnection
        .db("push")
        .collection("users")
        .updateOne(
          { _id: ObjectId(userId), email },
          { $set: { password: passwordHashed, salt: salt } },
        );
      if (matchedCount && modifiedCount) {
        res.sendFile(path.join(__dirname, "../assets", "password-reset-success.html"));
      }
    }
  });
};

module.exports = {
  userSignUp,
  userLogin,
  oAuthSignIn,
  forgotPassword,
  resetPassword,
};
