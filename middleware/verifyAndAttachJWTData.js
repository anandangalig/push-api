const jwt = require("express-jwt");

const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
};

module.exports = jwt({
  secret: process.env.JWT_SIGNATURE, //same  secret that we used to sign the JWT
  userProperty: "tokenData", // this is where the next middleware can find the encoded data generated in attachCurrentUser -> 'req.tokenData'
  getToken: getTokenFromHeader, // custom function to get the auth token from the request
  algorithms: ["RS256"],
});
