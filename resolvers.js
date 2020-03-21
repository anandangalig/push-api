const mongoUtils = require("./mongoUtils");

const goalsResolver = async () => {
  const database = mongoUtils.getDatabase();
  const goals = await database
    .collection("goals")
    .find()
    .toArray();

  return goals;
};

const resolvers = {
  Query: { goals: goalsResolver },
};

module.exports = resolvers;
