const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

const fs = require('fs');

console.log("HELLO");
console.log(fs.readdirSync(path.join(__dirname, '../db')));

const { querier, connectionWrapper } = require(path.join(__dirname, '../db/index.js'));
const { store_config, session_config } = require(path.join(__dirname, './server_config.js'));
const { ezCompare } = require('easycrypt');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore(store_config);
session_config.store = sessionStore;
app.use(session(session_config));

const touchSession = (req, res, next) => {
  if(req.session.views === undefined) {
    req.session.views = 0;
    req.session.host = req.headers.host;
    req.session['user_agent'] = req.headers['user-agent'];
  } else {
    req.session.views++;
  }
  next();
}
app.use(touchSession);

const checkLoggedIn = (req, res, next) => {
  if(!req.session.loggedIn) {
    if(req.method === "GET") {
       res.redirect(302, '/');
    } else {
      res.status(401);
      res.json({ error: "Must be logged in for that action. "});
      return;
    }
  }
  next();
}

module.exports = { checkLoggedIn };

const routes = require(path.join(__dirname, "./routes"));
app.use(routes);

app.get('/', function (req, res, next) {
  if(req.session.loggedIn) {
    res.sendFile(path.join(__dirname, '../front-end', 'docs.html'));
  } else {
    res.sendFile(path.join(__dirname, '../front-end', 'index.html'));
  }
})

app.use(express.static(path.join(__dirname, '../front-end')));

app.get('/doc', function(req, res, next) {
  const { documentmeta_id } = req.query;
  if (!documentmeta_id) {
    res.redirect(302, '/docs');
    return;
  }
  res.sendFile(path.join(__dirname, '../front-end', 'doc.html'));
});

app.get('/login', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../front-end', 'login.html'));
});

app.get('/create', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../front-end', 'create.html'));
});

app.post('/login', function (req, res, next) {
  const { display_name, pswd } = req.body;
  if (!(display_name && pswd)) {
    res.status(400);
    res.json({ error: "Invalid login request" });
    return;
  }
  (async function () {
    const user = await querier.user.get.display_name({
      display_name
    });
    let out;
    try {
      out = await connectionWrapper(user);
    } catch(e) {
      res.status(500);
      res.json({ error: e });
      console.error(e);
      return;
    }
    console.log(out);
    if(out.length !== 0 && ezCompare(pswd, out[0].pswd)) {

      req.session.loggedIn = true;
      req.session.user_id = out[0].user_id;
      req.session.display_name = out[0].display_name;
      res.redirect(302, '/');
    } else {
      res.redirect(302, '/login');
    }
  })();
});

app.get("*", function(req, res) {
  res.redirect(302, '/');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
