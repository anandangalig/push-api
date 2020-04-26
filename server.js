const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");
const { isNil } = require("ramda");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { attachCurrentUser, verifyAndAttachJWTData } = require("./middleware");
const { userLogin, userSignUp, forgotPassword } = require("./helpers");

require("dotenv").config();

// init express
const app = express();
// init Apollo server with GraphQL schema and context with user info
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: (request) =>
    isNil(request.req.currentUser) ? null : { currentUserID: request.req.currentUser._id },
});

app.get("/", (req, res) => res.send("Welcome Push User"));

// Handle user signup and login:
app.post("/signup", bodyParser.json(), userSignUp);
app.get("/login", bodyParser.json(), userLogin);
app.post("/forgot-password", bodyParser.json(), forgotPassword);
// Add custom middlewares
app.post("/graphql", verifyAndAttachJWTData, attachCurrentUser);
// Connect Express server with Apollo server
server.applyMiddleware({ app: app });

app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000`),
);
