const path = require('path');
const config = require(path.join(__dirname, '../config.js')).app;
const jwt = require('jsonwebtoken');
const db = require('better-sqlite3')(config.storage.db.main.path);

exports.proceed = (params) => {
  // todo kyc webhook request proceeding here
  return {result: success};
  // todo should return what is required by KYC provider API
}