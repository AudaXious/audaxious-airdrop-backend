const jwt = require("jsonwebtoken");
const path = require("path");
const config = require(path.join(__dirname, '../config.js')).app;
const db = require('better-sqlite3')(config.storage.db.main.path);

exports.verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send(
      {
        success: false,
        errors: ['A token is required for authentication'],
      }
    );
  }
  try {
    const userData = jwt.verify(token, config.jwtKey);
    const userRecord = db.prepare('SELECT * FROM users WHERE address = :address')
      .get({address: userData.address});
    if (!userRecord) {
      return res.status(403).send(
        {
          success: false,
          errors: ['User not found'],
        }
      );
    }
    req.user = userRecord;
  } catch (error) {
    console.error('Token verification error', error);
    return res.status(401).send(
      {
        success: false,
        errors: ['Invalid Token'],
      }
    );
  }
  return next();
};
