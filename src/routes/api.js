const express = require('express');
const path = require('path');
const router = express.Router();
const Controllers = require(path.join(__dirname, '../controllers'));
const Middleware = require(path.join(__dirname, '../middleware'));

router.get('/auth/get-token', (req, res, next) => {
  Controllers.Auth.getToken(req, res, next)
    .catch(err => next(err));
  }
);

router.post('/auth/login', (req, res, next) => {
  Controllers.Auth.login(req, res, next)
    .catch(err => next(err));
  }
);

router.get('/twitter/auth', Middleware.auth.verifyToken, (req, res, next) => {
  Controllers.Twitter.auth(req, res, next)
    .catch(err => next(err));
  }
);

router.get('/twitter/callback', (req, res, next) => {
  Controllers.Twitter.callback(req, res, next)
    .catch(err => next(err));
  }
);

router.post('/twitter/unbind', Middleware.auth.verifyToken, (req, res, next) => {
  Controllers.Twitter.unbind(req, res, next)
    .catch(err => next(err));
  }
);

router.get('/airdrop', Middleware.auth.verifyToken, (req, res, next) => {
    Controllers.Airdrop.get(req, res, next)
      .catch(err => next(err));
  }
);

module.exports = router;