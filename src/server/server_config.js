module.exports = {
  "store_config": {
    "port": 3306,
    "user": 'root',
    "password": process.env.MYSQL_PW,
    "database": '4YOU',
    "clearExpired": true,
    "checkExpirationInterval": 900000,
    "expiration": 86400000,
    "createDatabaseTable": true,
  },
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
