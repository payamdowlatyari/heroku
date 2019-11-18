const router = require('express').Router();
const path = require('path');
const { querier, connectionWrapper } = require(path.join(__dirname, '../../../db'));
const { ranstr } = require(path.join(__dirname, '../../../utils'));
const { checkLoggedIn } = require(path.join(__dirname, '../../server'));

router.get('/', checkLoggedIn, function(req, res) {
  const { pull_id } = req.query;
  if (!pull_id) {
    res.status(400);
    res.json({ error: "Invalid create document creation request" });
    return;
  }

  (async function() {
    const query = await querier.pull.get({
      pull_id
    });
    let out;
    try {
      out = await connectionWrapper(query);
    } catch(e) {
      res.status(500);
      res.json({ error: e });
      return;
    }

    res.status(200);
    res.json(out);
  })();
});

router.post('/', checkLoggedIn, function(req, res) {
  const { fork_id } = req.body;
  if(!fork_id) {
    res.status(400);
    res.json({ error: "Invalid create fork creation request" });
    return;
  }

  (async function () {
    const query = await querier.pull.create({
      pull_id: ranstr(12),
      fork_id
    });
    let out;
    try {
      out = await connectionWrapper(query);
    } catch(e) {
      res.status(500);
      res.json({ error: e });
      console.error(e);
      return;
    }
    res.status(201);
    res.json(out);
  })();
})

router.delete('/', checkLoggedIn, function (req, res) {
  const { pull_id } = req.query;
  if(!pull_id) {
    res.status(400);
    res.json({ error: "Must send valid query param" });
    return;
  }

  (async function () {
    const query = await querier.pull.delete({
      pull_id
    });
    let out;
    try {
      out = await connectionWrapper(query);
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
