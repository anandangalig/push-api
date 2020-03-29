const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    goals: [Goal]
    getGoalDetails(goalId: String!): Goal
  }
  type Mutation {
    createGoal(goalCreateInput: GoalCreateInput): Goal
    deleteGoal(goalId: ID!): ID
    updateGoal(goalUpdateInput: GoalUpdateInput): Goal
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
  input GoalCreateInput {
    title: String!
    cadence: String!
  }
  input GoalUpdateInput {
    _id: ID!
    title: String
    cadence: String
    cadenceCount: Int
    totalCount: Int
    timeStamps: [String]
  }
`;

module.exports = typeDefs;
