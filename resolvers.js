const ObjectId = require("mongodb").ObjectID;
const mongoUtils = require("./mongoUtils");

const getGoals = async () => {
  const database = mongoUtils.getDatabase();
  const goals = await database
    .collection("goals")
    .find()
    .toArray();

  return goals;
};

const createGoal = async (parent, args) => {
  const database = mongoUtils.getDatabase();
  const result = await database.collection("goals").insertOne({
    title: args.goalInput.title,
    cadence: args.goalInput.cadence,
    cadenceCount: 0,
    totalCount: 0,
    timeStamps: [],
  });

  return result.ops[0];
};
const getGoalDetails = async (parent, args) => {
  const database = mongoUtils.getDatabase();
  const [result] = await database
    .collection("goals")
    .find({ _id: ObjectId(args.goalId) })
    .toArray();

  return result;
};

const resolvers = {
  Query: {
    goals: getGoals,
    getGoalDetails: getGoalDetails,
  },
  Mutation: {
    createGoal: createGoal,
    // updateGoal: updateGoal,
    // deleteGoal: deleteGoal,
  },
};

module.exports = resolvers;
