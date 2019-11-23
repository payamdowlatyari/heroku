const router = require('express').Router();
const path = require('path');
const { querier, connectionWrapper } = require(path.join(__dirname, '../../../db'));
const { ranstr } = require(path.join(__dirname, '../../../utils'));
const { checkLoggedIn } = require(path.join(__dirname, '../../server'));

router.get('/', function(req, res) {
  const { documentmeta_id } = req.query;

  (async function() {
    let query;
    if(documentmeta_id) {
      query = await querier.documentmeta.get.one({
        documentmeta_id
      });
    } else {
      query = await querier.documentmeta.get.all({
        user_id: req.session.user_id
      });
    }
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
  const { fork_id, title } = req.body;
  if (!title) {
    res.status(400);
    res.json({ error: "Invalid create document creation request" });
    return;
  }

  (async function () {
    const document_id = ranstr(12);
    const query1 = await querier.document.create({
      document_id,
      delta_content: {},
      delta_change: {}
    });
    const query2 = await querier.documentmeta.create({
      documentmeta_id: ranstr(12),
      document_id,
      fork_id,
      creator_id: req.session.user_id,
      title
    });

    let out;
    try {
      await connectionWrapper(query1);
      out = await connectionWrapper(query2);
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
    res.status(201);
    res.json(out);
  })();
})

router.patch('/', checkLoggedIn, function(req, res) {
  const { title, documentmeta_id } = req.query;
  console.log(title, documentmeta_id);
  if(!(title && documentmeta_id)) {
    res.status(400);
    res.json({ error: "Must send valid query param" });
    return;
  }

  (async function () {
    const query = await querier.documentmeta.update.title({
      title,
      documentmeta_id
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
    console.log(out);

    res.status(201);
    res.json(out);
  })();
});

router.delete('/', checkLoggedIn, function (req, res) {
  const { documentmeta_id } = req.query;
  if(!documentmeta_id) {
    res.status(400);
    res.json({ error: "Must send valid query param" });
    return;
  }
  (async function () {
    const query = await querier.documentmeta.delete({
      documentmeta_id
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
