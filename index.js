const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

// init Apollo server with GraphQL types and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// init express
const app = express();

// connect Express with Apollo
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
