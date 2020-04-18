const { getMongoConnection } = require("../helpers");

module.exports = async (req, res, next) => {
  try {
    const decodedTokenData = req.tokenData;
    const mongoConnection = await getMongoConnection();
    const userRecord = await mongoConnection
      .db("push")
      .collection("users")
      .findOne({ _id: decodedTokenData._id });

    req.currentUser = userRecord;

    if (!userRecord) {
      return res.status(401).end("User not found");
    } else {
      return next();
    }
  } catch (e) {
    return res.json(e).status(500);
  }
};
