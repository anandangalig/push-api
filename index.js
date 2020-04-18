const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { attachCurrentUser, verifyAndAttachJWTData } = require("./middleware");
const { userLogin, userSignUp } = require("./helpers");

require("dotenv").config();

// init Apollo server with GraphQL types and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// init express
const app = express();
// Handle user signup and login:
app.post("/signup", bodyParser.json(), userSignUp);
app.get("/login", bodyParser.json(), userLogin);
// add custom middlewares
app.use("/graphql", verifyAndAttachJWTData, attachCurrentUser); // all operations except Signup and Login should be sent to this endpoint

// connect Express with Apollo
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
