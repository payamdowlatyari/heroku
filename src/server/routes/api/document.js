const router = require('express').Router();
const path = require('path');
const { querier, connectionWrapper } = require(path.join(__dirname, '../../../db'));
const { ranstr } = require(path.join(__dirname, '../../../utils'));
const { checkLoggedIn } = require(path.join(__dirname, '../../server'));

router.get('/', function(req, res) {
  const { document_id } = req.query;
  if(!document_id) {
    res.status(400);
    res.json({ error: "Must send id" });
    return;
  }

  (async function() {
    const doc = await querier.document.get({
      document_id
    });
    const out = await connectionWrapper(doc);
    res.status(200);
    res.json(out);
  })();
});

router.put('/', checkLoggedIn, function(req, res) {
  let { delta_change, delta_content, document_id } = req.body;
  if(!(delta_content && delta_change && document_id)) {
    res.status(400);
    res.json({ error: "Must send valid query param" });
    return;
  }

  if ((typeof delta_change !== "object") || (typeof delta_content !== "object")) {
    try {
      delta_content = JSON.parse(delta_content);
      delta_change = JSON.parse(delta_change);
    } catch (e) {
      res.status(500);
      res.json({
        error: e
      });
      return;
    }
  }

  (async function () {
    const user = await querier.document.update({
      delta_content,
      delta_change,
      document_id
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
  const { document_id } = req.query;
  if(!document_id) {
    res.status(400);
    res.json({ error: "Must send valid query param" });
    return;
  }
  (async function () {
    const doc = await querier.document.delete({
      document_id
    });
    let out;
    try {
      out = await connectionWrapper(doc);
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
