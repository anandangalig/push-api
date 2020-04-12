const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { attachCurrentUser, verifyAndAttachJWTData } = require("./middleware");
require("dotenv").config();

// init Apollo server with GraphQL types and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// init express
const app = express();

// add custom middlewares
app.use("/graphql/with-auth", verifyAndAttachJWTData, attachCurrentUser); // all operations except Signup and Login should be sent to this endpoint

// connect Express with Apollo
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
