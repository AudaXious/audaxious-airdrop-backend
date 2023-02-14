const path = require("path");
const config = require(path.join(__dirname, '../config.js'));
const db = require('better-sqlite3')(config.app.storage.db.main.path);

exports.add = (req) => {
  const address = req.user.address.toLowerCase();
  const record = db.prepare(`
    SELECT id, whitelisted FROM users WHERE address = :address
  `).get({address: address});
  if (record && record.whitelisted !== null) {
    return {
      success: false,
      errors: [`Address ${address} has been already added`],
    };
  } else if (record) {
    db.prepare(`UPDATE users SET whitelisted = 0 WHERE id = :id`)
      .run({id: record.id});
  } else {
    const now = Math.round(Date.now() / 1000);
    db.prepare(`
        INSERT INTO users (address, createdAt)
        VALUES (:address, :createdAt)
    `)
      .run({
        address: address,
        createdAt: now,
      });
  }
  return {
    success: true,
    errors: [],
    message: `Address ${address} was successfully added`
  }
};

exports.confirm = (req) => {
  if (!req.body.address) {
    return {
      success: false,
      errors: ['address field is required'],
    }
  }
  const address = req.body.address.toLowerCase();
  const id = db.prepare(`SELECT id FROM users WHERE address = :address`)
    .pluck().get({address: address});
  if (!id) {
    return {
      success: false,
      errors: ['Address is not found'],
    }
  }
  db.prepare(`UPDATE users SET whitelisted = 1 WHERE id = :id`)
    .run({id: id});

  return {
    success: true,
    message: `Address was successfully whitelisted`
  }
};

exports.reject = (req) => {
  if (!req.body.address) {
    return {
      success: false,
      errors: ['address field is required'],
    }
  }
  const address = req.body.address.toLowerCase();
  const id = db.prepare(`SELECT id FROM users WHERE address = :address`)
    .pluck().get({address: address});
  if (!id) {
    return {
      success: false,
      errors: ['Address is not found'],
    }
  }
  db.prepare(`UPDATE users SET whitelisted = 2 WHERE id = :id`)
    .run({id: id});

  return {
    success: true,
    message: `Address was successfully removed from the whitelist`
  }
};