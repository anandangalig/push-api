const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");
const { isNil } = require("ramda");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { attachCurrentUser, verifyAndAttachJWTData } = require("./middleware");
const { userLogin, userSignUp } = require("./helpers");

require("dotenv").config();

// init express
const app = express();
// init Apollo server with GraphQL schema and context with user info
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (request) =>
    isNil(request.req.currentUser) ? null : { currentUserID: request.req.currentUser._id },
});

// Handle user signup and login:
app.post("/signup", bodyParser.json(), userSignUp);
app.post("/login", bodyParser.json(), userLogin);
// Add custom middlewares
app.post("/graphql", verifyAndAttachJWTData, attachCurrentUser);
// Connect Express server with Apollo server
server.applyMiddleware({ app: app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
