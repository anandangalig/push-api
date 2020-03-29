const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

let _db;
module.exports = {
  connectToServer: callback => {
    // eslint-disable-next-line no-undef
    MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true }, function(err, client) {
      _db = client.db("push_app");

      return callback(err, client);
    });
  },

  getDatabase: () => {
    return _db;
  },
};
