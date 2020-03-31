const { ObjectId } = require("mongodb");
const { omit } = require("ramda");
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
    cadence: args.goalCreateInput.cadence,
    cadenceCount: args.goalCreateInput.cadenceCount,
    creationDate: new Date(),
    creatorID: "",
    timeStamps: [],
    title: args.goalCreateInput.title,
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
    getGoalDetails: getGoalDetails,
    goals: getGoals,
  },
  Mutation: {
    createGoal: createGoal,
    deleteGoal: deleteGoal,
    updateGoal: updateGoal,
  },
};

module.exports = resolvers;
