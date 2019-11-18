const path = require('path');
const connectionGenerator = require(path.join(__dirname, './connection_generator'));
const logins = require(path.join(__dirname, './logins'));

module.exports = { 
  connection: connectionGenerator(logins(process.env.NODE_ENV))
};
