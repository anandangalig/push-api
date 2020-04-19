const argon2 = require("argon2");
const { randomBytes } = require("crypto");
const generateJWT = require("./jwt");
const getMongoConnection = require("./mongoConnect");

const userSignUp = async (req, res) => {
  const { userName, password, email } = req.body;
  const salt = randomBytes(32);
  const passwordHashed = await argon2.hash(password, { salt }); //https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback

  const mongoConnection = await getMongoConnection();
  const { insertedId } = await mongoConnection.db("push").collection("users").insertOne({
    userName,
    email,
    password: passwordHashed,
    salt,
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
    res.status(404).send("User Not Found");
  } else {
    const correctPassword = await argon2.verify(userRecord.password, password);
    if (!correctPassword) {
      res.status(401).send("Incorrect Password");
    }
  }

  const token = userRecord ? generateJWT(userRecord) : null;

  res.send({
    token,
    email,
    userName: userRecord.userName,
  });
};

module.exports = {
  userSignUp,
  userLogin,
};
