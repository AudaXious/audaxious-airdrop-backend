const path = require("path");
const config = require(path.join(__dirname, '../config.js')).app;

exports.render = (id, dbName, table, columnsArray) => {
  const db = require('better-sqlite3')(config.storage.db[dbName].path);
  const columns = columnsArray.join(',');
  const item = db.prepare(`
    SELECT ${columns} FROM ${table} WHERE id = :id
  `).get({id: id});
  if (!item) {
    return {
      success: false,
      errors: ['Item is not found'],
    };
  }
  return {
    success: true,
    errors: [],
    result: item
  };
}