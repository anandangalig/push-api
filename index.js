const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoUtils = require("./mongoUtils");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

// connect to MongoDB server
mongoUtils.connectToServer((err, client) => {
  if (err) console.error(err);
  console.log("Client has been established: ", client.s.url);
});

// init Apollo server with GraphQL types and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// init express
const app = express();

// connect Express with Apollo
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
