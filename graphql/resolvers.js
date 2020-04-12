const { ObjectId } = require("mongodb");
const { omit } = require("ramda");
const argon2 = require("argon2");
const { randomBytes } = require("crypto");

const { getMongoConnection, generateJWT } = require("../helpers");

// ============== GOALS: ==============================================
const getGoals = async () => {
  const mongoConnection = await getMongoConnection();
  const goals = await mongoConnection.db("push").collection("goals").find().toArray();

  return goals;
};

const createGoal = async (parent, args) => {
  const mongoConnection = await getMongoConnection();
  const result = await mongoConnection.db("push").collection("goals").insertOne({
    cadence: args.goalCreateInput.cadence,
    cadenceCount: args.goalCreateInput.cadenceCount,
    creationDate: new Date().toISOString(),
    creatorID: "",
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

// ============== USERS: ==============================================

const userSignUp = async (parent, { userName, password, email }) => {
  const passwordHashed = await argon2.hash(password, { salt: randomBytes(32) }); //https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback

  const mongoConnection = await getMongoConnection();
  const { insertedId } = await mongoConnection.db("push").collection("users").insertOne({
    userName,
    password: passwordHashed,
    email,
  });

  const token = insertedId ? generateJWT({ insertedId, userName, email }) : null;

  return {
    token,
    email,
    userName,
  };
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
    userSignUp: userSignUp,
  },
};

module.exports = resolvers;
