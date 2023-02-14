const path = require("path");
const config = require(path.join(__dirname, '../config.js')).app;
const db = require('better-sqlite3')(config.storage.db.main.path);

exports.checkRole = (roleId) => {
  return (req, res, next) => {
    if (!req.user)  {
      return res.send({
        success: false,
        errors: ['User not found'],
      });
    }
    const hasRole = db.prepare(`
      SELECT id FROM roles WHERE userId = :userId AND roleId = :roleId
    `).get({
      userId: req.user.id,
      roleId: roleId
    });
    if (!hasRole)  {
      return res.send({
        success: false,
        errors: ['Not authorized'],
      });
    }
    return next();
  }
};
