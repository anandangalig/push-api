const express = require('express');
const bodyParser = require('body-parser'); // parses HTTP request's body to filter out unwanted stuff
const { graphqlExpress, graphiqlExpress, gql } = require('apollo-server-express'); // integrated GraphQL with Express
const { makeExecutableSchema } = require('graphql-tools'); // creates the GraphQL schema

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});
