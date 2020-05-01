const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");
const { isNil } = require("ramda");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { attachCurrentUser, verifyAndAttachJWTData } = require("./middleware");
const { userLogin, userSignUp, forgotPassword, resetPassword } = require("./helpers");

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

app.use(express.static("assets"));

app.get("/", (_, res) => res.send("Welcome Push Pirates!"));

// Handle user signup and login:
app.post("/signup", bodyParser.json(), userSignUp);
app.get("/login", bodyParser.json(), userLogin);

// Handle password reset:
app.post("/forgot-password", bodyParser.json(), forgotPassword);

app.get("/reset-password", (_, res) => res.sendFile(__dirname + "/assets/password-reset.html"));
app.post("/reset-password", bodyParser.urlencoded({ extended: true }), resetPassword);

// Add custom middlewares to all other requests:
app.post("/graphql", verifyAndAttachJWTData, attachCurrentUser);

// Connect Express server with Apollo server
server.applyMiddleware({ app: app });

app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000`),
);
