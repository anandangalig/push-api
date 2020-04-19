const { ObjectId } = require("mongodb");
const { omit } = require("ramda");
const { getMongoConnection } = require("../helpers");

const getGoals = async (parent, args, { currentUserID }) => {
  const mongoConnection = await getMongoConnection();
  const goals = await mongoConnection
    .db("push")
    .collection("goals")
    .find({ creatorID: ObjectId(currentUserID) })
    .toArray();

  return goals;
};

const createGoal = async (parent, args, { currentUserID }) => {
  const mongoConnection = await getMongoConnection();
  const result = await mongoConnection
    .db("push")
    .collection("goals")
    .insertOne({
      cadence: args.goalCreateInput.cadence,
      cadenceCount: args.goalCreateInput.cadenceCount,
      creationDate: new Date().toISOString(),
      creatorID: ObjectId(currentUserID),
      timeStamps: [],
      title: args.goalCreateInput.title,
    });

  return result.ops[0];
};

const getGoalDetails = async (parent, args) => {
  const mongoConnection = await getMongoConnection();
  const [result] = await mongoConnection
    .db("push")
    .collection("goals")
    .find({ _id: ObjectId(args.goalId) })
    .toArray();

  return result;
};

const deleteGoal = async (parent, args) => {
  const mongoConnection = await getMongoConnection();
  const { deletedCount } = await mongoConnection
    .db("push")
    .collection("goals")
    .deleteOne({ _id: ObjectId(args.goalId) });

  return deletedCount > 0 ? args.goalId : null;
};

const updateGoal = async (parent, args) => {
  //TODO: sending the whole object is inefficient. Need to refactor this to send only the updated fields.
  const mongoConnection = await getMongoConnection();
  const { matchedCount, modifiedCount } = await mongoConnection
    .db("push")
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
