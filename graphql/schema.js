const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getGoalDetails(goalId: String!): Goal
    goals: [Goal]
  }
  type Mutation {
    createGoal(goalCreateInput: GoalCreateInput): Goal
    deleteGoal(goalId: ID!): ID
    updateGoal(goalUpdateInput: GoalUpdateInput): Goal
    userSignUp(userName: String, password: String, email: String): AuthConfirmation
  }
  # General Types:
  type Goal {
    _id: ID
    cadence: String
    cadenceCount: Int
    creationDate: String
    creatorID: String
    timeStamps: [String]
    title: String
  }
  type AuthConfirmation {
    token: String
    email: String
    userName: String
  }
  # Inputs Types:
  input GoalCreateInput {
    title: String!
    cadence: String!
    cadenceCount: Int!
  }
  input GoalUpdateInput {
    _id: ID!
    cadence: String!
    cadenceCount: Int!
    timeStamps: [String]!
    title: String!
  }
`;

module.exports = typeDefs;
