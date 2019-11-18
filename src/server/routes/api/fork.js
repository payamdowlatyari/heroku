const router = require('express').Router();
const path = require('path');
const { querier, connectionWrapper } = require(path.join(__dirname, '../../../db'));
const { ranstr } = require(path.join(__dirname, '../../../utils'));
const { checkLoggedIn } = require(path.join(__dirname, '../../server'));

router.get('/', checkLoggedIn, function(req, res) {
  const { fork_id } = req.query;
  if (!fork_id) {
    res.status(400);
    res.json({ error: "Invalid create document creation request" });
    return;
  }

  (async function() {
    const query = await querier.fork.get({
      fork_id
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
  const { documentmeta_id } = req.body;
  if(!documentmeta_id) {
    res.status(400);
    res.json({ error: "Invalid create fork creation request" });
    return;
  }

  (async function () {
    // there's no checking on whether documentmeta_id exsts, assumed to
    const fork_id = ranstr(12);
    const query1 = await querier.fork.create({
      fork_id,
      original_doc_meta_id: documentmeta_id
    });

    const query2 = await querier.documentmeta.get.one({
      documentmeta_id
    });

    let out;
    let docmeta;
    let doc;
    try {
      out = await connectionWrapper(query1);
      docmeta = (await connectionWrapper(query2))[0];
      const query2a = await querier.document.get({
        document_id: docmeta.document_id
      });
      doc = (await connectionWrapper(query2a))[0];

    } catch(e) {
      res.status(500);
      res.json({ error: e });
      console.error(e);
      return;
    }
    const delta_content = doc.delta_content;
    const delta_change = doc.delta_change;

    for (const entry of delta_content.ops) {
      entry.insert = entry.insert.replace(/\n/g, '\\n');
    }

    const document_id = ranstr(12);
    const query3 = await querier.document.create({
      document_id,
      delta_content,
      delta_change
    });

    const query4 = await querier.documentmeta.create({
      documentmeta_id: ranstr(12),
      document_id,
      fork_id,
      creator_id: req.session.user_id,
      title: docmeta.title
    });

    try {
      await connectionWrapper(query3);
      await connectionWrapper(query4);
    } catch (e) {
      res.status(500);
      res.json({ error: e });
      console.error(e);
      return;
    }

    res.status(201);
    res.json(out);
  })();
})

router.patch('/', checkLoggedIn, function(req, res) {
  const { fork_id } = req.query;
  if (!fork_id) {
    res.status(400);
    res.json({ error: "Invalid create document creation request" });
    return;
  }

  (async function () {
    const query = await querier.fork.update.last_pull({
      fork_id
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

router.delete('/', checkLoggedIn, function (req, res) {
  const { fork_id } = req.query;
  if(!fork_id) {
    res.status(400);
    res.json({ error: "Must send valid query param" });
    return;
  }
  (async function () {
    const query = await querier.fork.delete({
      fork_id
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
