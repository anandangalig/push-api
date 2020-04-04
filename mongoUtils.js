const { MongoClient } = require("mongodb");
require("dotenv").config();

let _db;
module.exports = {
  connectToServer: callback => {
    MongoClient.connect(
      // eslint-disable-next-line no-undef
      process.env.MONGO_ATLAS_URI,
      { useUnifiedTopology: true, useNewUrlParser: true },
      (err, client) => {
        if (err) {
          console.error(err);
        }
        _db = client.db("push");
        return callback(err, client);
      },
    );
  },

  getDatabase: () => {
    return _db;
  },
};
