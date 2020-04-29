const generateJWT = require("./jwt");
const getMongoConnection = require("./mongoConnect");
const { userLogin, userSignUp, forgotPassword, resetPassword } = require("./userAuth");

module.exports = {
  generateJWT,
  getMongoConnection,
  userLogin,
  userSignUp,
  forgotPassword,
  resetPassword,
};
