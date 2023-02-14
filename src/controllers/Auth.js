const path = require('path');
const modules = require(path.join(__dirname, '../modules'));
const config = require(path.join(__dirname, '../config.js')).app;
const db = require('better-sqlite3')(config.storage.db.main.path);

exports.login = async(req, res) => {
  return res.send(modules.signature.verify(req.body));
}

exports.getToken = async(req, res) => {
  res.send(await modules.signature.getToken());
}

exports.disableToken = async(req, res) => {
  res.send(await modules.auth.disableToken(req.body, req.user));
}

exports.addRole = async(req, res) => {
  return res.send(modules.auth.addRole(req.body));
}

exports.removeRole = async(req, res) => {
  return res.send(modules.auth.removeRole(req.body));
}

exports.getData = async(req, res) => {
  const record = db.prepare(
    `SELECT * FROM users WHERE address = :address`
  )
    .get({
      address: req.user.address,
    });
  if (!record) {
    console.error('controllers.Auth.getData User record does not exist');
    throw new Error('An error occurred');
  }
  return res.send({
    success: true,
    result: {
      telegram: !!record.telegramId,
      twitter: !!record.twitterData
    },
  });
}