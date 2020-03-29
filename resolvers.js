const ObjectId = require("mongodb").ObjectID;
const mongoUtils = require("./mongoUtils");
const { omit } = require("ramda");

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
    title: args.goalCreateInput.title,
    cadence: args.goalCreateInput.cadence,
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

const deleteGoal = async (parent, args) => {
  const database = mongoUtils.getDatabase();
  const { deletedCount } = await database
    .collection("goals")
    .deleteOne({ _id: ObjectId(args.goalId) });

  return deletedCount > 0 ? args.goalId : null;
};

const updateGoal = async (parent, args) => {
  const database = mongoUtils.getDatabase();
  const { matchedCount, modifiedCount } = await database
    .collection("goals")
    .updateOne(
      { _id: ObjectId(args.goalUpdateInput._id) },
      { $set: omit(["_id"], args.goalUpdateInput) },
    );

  return matchedCount && modifiedCount ? args.goalUpdateInput : null;
};

const resolvers = {
  Query: {
    goals: getGoals,
    getGoalDetails: getGoalDetails,
  },
  Mutation: {
    createGoal: createGoal,
    updateGoal: updateGoal,
    deleteGoal: deleteGoal,
  },
};

module.exports = resolvers;
