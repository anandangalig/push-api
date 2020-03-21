const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    goals: [Goal]
  }
  type Goal {
    title: String
    cadence: String
    cadenceCount: Int
    totalCount: Int
    timeStamps: [String]
  }
`;

module.exports = typeDefs;
