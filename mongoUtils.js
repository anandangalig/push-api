const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

let _db;

module.exports = {
  connectToServer: callback => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
      _db = client.db("push_app");

      return callback(err, client);
    });
  },

  getDatabase: () => {
    return _db;
  },
};
