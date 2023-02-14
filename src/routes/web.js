const express = require('express');
const path = require('path');
const router = express.Router();
const Controllers = require(path.join(__dirname, '../controllers'));
const Middleware = require(path.join(__dirname, '../middleware'));

router.get('/twitter/callback', (req, res, next) => {
  Controllers.Twitter.callback(req, res, next)
    .catch(err => next(err));
  }
);

module.exports = router;