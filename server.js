const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");
const { isNil } = require("ramda");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { attachCurrentUser, verifyAndAttachJWTData, validateInput } = require("./middleware");
const { userLogin, userSignUp, forgotPassword, resetPassword, attachPushToken, scheduleNotifications} = require("./helpers");

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

app.get("/", (_, res) => res.send("Welcome Push Pirates!"));

app.use(express.static("assets")); //allows access to /assets dir
app.use(bodyParser.json()); //allows pulling info from body in JSON format
app.use(bodyParser.urlencoded({ extended: true })); //allows accessto URL params

// Handle user signup and login:
app.post("/login", userLogin);
app.post("/signup", validateInput(["password", "email"]), userSignUp);

// Handle password reset:
app.get("/reset-password", (_, res) => res.sendFile(__dirname + "/assets/password-reset.html"));
app.post("/reset-password", validateInput(["newPassword", "newPasswordConfirm"]), resetPassword);
app.post("/forgot-password", validateInput(["email"]), forgotPassword);

// Add custom middlewares to all other requests:
app.post("/graphql", verifyAndAttachJWTData, attachCurrentUser);
app.post("/push", attachPushToken);
app.post("/run-notifications", scheduleNotifications);
// Connect Express server with Apollo server
server.applyMiddleware({ app: app });

app.listen({ port: process.env.PORT || 4000 }, () => {
  console.log("🚀 Server is up and running");
});
