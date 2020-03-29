const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    goals: [Goal]
    getGoalDetails(goalId: String!): Goal
  }
  type Mutation {
    createGoal(goalInput: GoalInput): Goal
    deleteGoal(goalId: ID!): ID
    updateGoal(goalInputUpdate: GoalInputUpdate): Goal
  }
  # General Types:
  type Goal {
    _id: ID
    title: String
    cadence: String
    cadenceCount: Int
    totalCount: Int
    timeStamps: [String]
  }
  # Inputs Types:
  input GoalInput {
    title: String!
    cadence: String!
  }
  input GoalInputUpdate {
    _id: ID!
    title: String
    cadence: String
    cadenceCount: Int
    totalCount: Int
    timeStamps: [String]
  }
`;

module.exports = typeDefs;
