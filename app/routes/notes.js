var express = require('express');
var router = express.Router();
const Note = require('../models/note.js');
const withAuth = require('../middlewares/auth.js');

router.post('/', withAuth, async function(req, res) {
    const { title, body } = req.body;
    var note = new Note({title: title, body: body, author: req.user._id});

    try {
      await note.save();
      res.json(note);
    } catch (error) {
      res.status(401).send(err);
    }
  });

  router.get('/:id', withAuth, async function(req, res) {
    try {
        const { id } = req.params;
        let note = await Note.findById(id);
        if(is_owner(req.user, note))
            res.json(note);
        else
            res.json({error: error}).status(500);
    } catch (error) {
      res.send(error).status(500)
    }
});

const is_owner = (user, note) => {
    if(JSON.stringify(user._id) == JSON.stringify(note.author._id))
      return true;
    else
      return false;
  }

  module.exports = router;