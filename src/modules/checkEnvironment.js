const path = require("path");
const fs = require('fs');
const config = require(path.join(__dirname, '../config.js')).app;
const directories = [
  path.resolve(__dirname, '../../db'),
];

exports.default = () => {
  directories.forEach(path => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  });

  for (let dbName in config.storage.db) {
    const db = require('better-sqlite3')(config.storage.db[dbName].path);
    for (let tableName in config.storage.db[dbName].tables) {
      const tableExists = db.prepare(`
        SELECT name FROM sqlite_master WHERE type = 'table' AND name = :name`
      ).get({name: tableName});
      if (!tableExists) {
        db.prepare(config.storage.db[dbName].tables[tableName]).run();
        if (config.storage.db[dbName].seeds[tableName]) {
          db.prepare(config.storage.db[dbName].seeds[tableName]).run();
        }
      }
    }
  }
  return true;
}