const path = require("path");
const config = require(path.join(__dirname, '../config.js')).app;

exports.webhook = (req, res, next) => {
  if (
    req.headers['x-telegram-bot-api-secret-token'] !== config.api.telegram.webHook.token
  ) return res.send('Access Denied');
  return next();
};
