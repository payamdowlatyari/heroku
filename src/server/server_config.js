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

const storeConfigs = {
  "dev": () => ({
    "port": 3306,
    "user": 'root',
    "password": process.env.MYSQL_PW,
    "database": '4YOU',
    "clearExpired": true,
    "checkExpirationInterval": 900000,
    "expiration": 86400000,
    "createDatabaseTable": true,
  }),
  "production": () => ({
    ...parse(process.env["JAWSDB_URL"]),
    "clearExpired": true,
    "checkExpirationInterval": 900000,
    "expiration": 86400000,
    "createDatabaseTable": true,
  }),
  "test": () => { throw new Error("test environment not implemented") },
}

function selectConfigMode(mode) {
  switch(mode) {
    case "dev":         return storeConfigs.dev();
    case "production":  return storeConfigs.production();
    case "test":        return storeConfigs.test();
    default: throw Error("Invalid mode passed to logins.js");
  }
}

module.exports = {
  "store_config": selectConfigMode(process.env.NODE_ENV),
  "session_config": {
    key: process.env.FOURYOU_Session_ID,
    secret: process.env.EXPRESS_SESSION_KEY,
    store: null,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: null,
      maxAge: 86400000,
    }
  }
}
