/* eslint-disable no-undef */
const { MongoClient } = require("mongodb");
require("dotenv").config();

let connection;
const getMongoConnection = async () => {
  if (connection) {
    return connection;
  }

  try {
    connection = await MongoClient.connect(process.env.MONGO_ATLAS_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      poolSize: 10,
    });
  } catch (e) {
    console.error(e);
  }

  return connection;
};

module.exports = getMongoConnection;
