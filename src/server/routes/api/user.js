const router = require('express').Router();
const { ezEncrypt } = require("easycrypt");
const path = require('path');
const { querier, connectionWrapper } = require(path.join(__dirname, '../../../db'));
const { ranstr } = require(path.join(__dirname, '../../../utils'));
const { checkLoggedIn } = require(path.join(__dirname, '../../server'));
const { existsHelper } = require(path.join(__dirname, '../../../utils'));

router.head('/', function(req, res) {
  const { prop, value } = req.query;
  if(!value || !prop || !(prop === "email" || prop === "display_name")) {
    res.status(400);
    res.end();
    return;
  }

  (async function () {
    const user = await querier.user.exists[prop]({
      [prop]: value
    });
    let out;
    try {
      out = await connectionWrapper(user);
    } catch (e) {
      console.error(e);
      res.status(500);
      res.end();
      return;
    }
    
    if(existsHelper(out)) {
      res.status(200);
    } else {
      res.status(400);
    }
    res.end();
  })();
});

router.get('/', checkLoggedIn, function(req, res) {
  (async function() {
    const user = await querier.user.get.user_id({
      user_id: req.session.user_id
    });
    const out = await connectionWrapper(user);
    res.status(200);
    res.json(out);
  })();
});

router.post('/', function(req, res) {
  const { display_name, email, pswd } = req.body;
  if (!(display_name && email && pswd)) {
    res.status(400);
    res.json({ error: "Invalid create user request" });
    return;
  }
  (async function () {
    const user = await querier.user.create({
      user_id: ranstr(8),
      email,
      pswd: ezEncrypt(pswd),
      display_name
    });
    let out;
    try {
      out = await connectionWrapper(user);
    } catch(e) {
      if(e.code === "ER_DUP_ENTRY") {
        res.status(400);
      } else if(e.code === "ER_BAD_NULL_ERROR") {
        res.status(400);
      } else {
        res.status(500);
      }
      res.json({ error: e });
      console.error(e);
      return;
    }
    res.redirect(302, '/login');
  })();
})

router.patch('/', checkLoggedIn, function(req, res) {
  const { prop, value } = req.query;
  if(!prop || !(prop === "email" || prop === "pswd" || prop === "display_name")) {
    res.status(400);
    res.json({ error: "Must send valid query param" });
    return;
  }

  if(!value) {
    res.status(400);
    res.json({ error: "Must send value" });
    return;
  }

  (async function () {
    const user = await querier.user.update[prop]({
      [prop]: value,
      user_id: req.session.user_id
    });
    let out;
    try {
      out = await connectionWrapper(user);
    } catch (e) {
      res.status(500);
      res.json({ error: e });
      console.error(e);
      return;
    }
    res.status(201);
    res.json(out);
  })();
});

router.delete('/', checkLoggedIn, function (req, res) {
  (async function () {
    const user = await querier.user.delete({
      user_id: req.session.user_id
    });
    let out;
    try {
      out = await connectionWrapper(user);
    } catch (e) {
      res.status(500);
      res.json({ error: e });
      console.error(e);
      return;
    }
    res.status(201);
    res.json(out);
  })();
});

module.exports = router;
