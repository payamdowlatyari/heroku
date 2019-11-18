const logins = {
  "dev": () => ({
    "host": "localhost",
    "user": "root",
    "password": process.env.MYSQL_PW,
    "multipleStatements": true,
    "port": 3306,
    "database": "4YOU"
  }),
  "production": () => ({
    "use_env_variable": "JAWSDB_URL",
    "dialect": "mysql"
  }),
  "test": () => { throw new Error("test environment not implemented") },
  "setup": () => ({
    "host": "localhost",
    "user": "root",
    "password": process.env.MYSQL_PW,
    "multipleStatements": true,
    "port": 3306
  })
}

module.exports = function(mode) {
  switch(mode) {
    case "dev":   return logins.dev();
    case "prod":  return logins.prod();
    case "test":  return logins.test();
    case "setup": return logins.setup();
    default: throw Error("Invalid mode passed to logins.js");
  }
}