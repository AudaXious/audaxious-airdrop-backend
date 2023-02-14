const path = require('path');
const config = require(path.join(__dirname, '../config.js')).app;
const jwt = require('jsonwebtoken');
const db = require('better-sqlite3')(config.storage.db.main.path);

exports.disableToken = (params, loggedUser) => {
  const token = params.disabledToken;
  try {
    const user = jwt.verify(token, config.jwtKey);
    if (user.id !== loggedUser.id) {
      return {
        success: false,
        errors: ['You are not authorized to disable this token'],
      };
    }
    const already = db.prepare(`
      SELECT id FROM disabledTokens WHERE token = :token
    `).pluck().get({token: token});
    if (already) {
      return {
        success: false,
        errors: ['Token is already disabled'],
      }
    }
    const now = Math.round(Date.now() / 1000);
    db.prepare(`
      INSERT INTO disabledTokens (token, createdAt) VALUES (:token, :createdAt)
    `).run({token: token, createdAt: now});
    return {
      success: true,
      errors: [],
    };
  } catch (error) {
    console.error('Token disable error', error);
    return {
      success: false,
      errors: ['Invalid token'],
    };
  }
}

exports.addRole = (params) => {
  const already = db.prepare(`
    SELECT id FROM roles WHERE userId = :userId AND roleId = :roleId
  `).pluck().get({
    userId: params.userId,
    roleId: params.roleId,
  });
  if (already) {
    return {
      success: false,
      errors: ['Role has been already added to this user'],
    }
  }
  const now = Math.round(Date.now() / 1000);
  db.prepare(`
    INSERT INTO roles (userId, roleId, createdAt) VALUES (:userId, :roleId, :createdAt)
  `).run({
    userId: params.userId,
    roleId: params.roleId,
    createdAt: now,
  });
  return {
    success: true,
    errors: [],
    message: 'Role was successfully added'
  };
}

exports.removeRole = (params) => {
  db.prepare(`
    DELETE FROM roles WHERE userId = :userId AND roleId = :roleId
  `).run({
    userId: params.userId,
    roleId: params.roleId
  });
  return {
    success: true,
    errors: [],
    message: 'Role was successfully removed'
  };
}