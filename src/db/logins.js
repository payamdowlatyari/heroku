function parse(url) {
  url = url.replace('mysql://', '');
  let [user, passhost, portschema] = url.split(':');
  let [password, host] = passhost.split('@');
  let [port, database] = portschema.split('/');

  const out = {
      user,
      password,
      host,
      port,
      database
  };

  return out;
}

console.log(parse(process.env["JAWSDB_URL"]))

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
    ...parse(process.env["JAWSDB_URL"])
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
    case "dev":         return logins.dev();
    case "production":  return logins.production();
    case "test":        return logins.test();
    case "setup":       return logins.setup();
    default: throw Error("Invalid mode passed to logins.js");
  }
}
