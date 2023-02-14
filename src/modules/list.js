const path = require("path");
const config = require(path.join(__dirname, '../config.js')).app;

const _filter = (req, db, table) => {
  let filter = {};
  if (req.query.filter) {
    try {
      filter = JSON.parse(req.query.filter);
    } catch (e) {}
  }
  let whereQuery = '';
  const where = [];
  const params = {};
  for (let column in filter) {
    if (config.storage.filter.excluded.indexOf(column) !== -1) continue;
    const columnExists = db.prepare(`
        SELECT COUNT(*) FROM pragma_table_info('${table}') WHERE name = ?
    `).pluck().get(column);
    if (!(columnExists > 0)) continue;
    if (typeof filter[column].value === 'undefined') continue;
    if (config.storage.filter.signs.indexOf(filter[column].sign) === -1) {
      filter[column].sign = '=';
    }
    where.push(`${column} ${filter[column].sign} :${column}`);
    params[column] = filter[column].value;
  }
  if (where.length) {
    whereQuery = ` WHERE ${where.join(' AND ')}`;
  }
  return {
    where: whereQuery,
    params: params
  };
}

const _paging = (req, db, table, count) => {
  const params = {
    querySuffix: '',
  };
  if (!table.length) {
    params.error = 'table is not defined';
    return params;
  }
  const tableExists = db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`).get(table);
  if (!tableExists) {
    params.error = 'table does not exist';
    return params;
  }

  params.sort = req.query.sort;
  if (params.sort) {
    const columnExists = db.prepare(`
        SELECT COUNT(*) FROM pragma_table_info('${table}') WHERE name = ?
    `).pluck().get(params.sort);
    if (!(columnExists > 0)) params.sort = '';
    if (params.sort) {
      params.querySuffix += ` ORDER BY ${params.sort}`;
      if (req.query.desc === '1') params.querySuffix += ` DESC`;
    }
  }

  params.page = parseInt(req.query.page);
  params.page = params.page > 0 ? params.page : 1;
  params.limit = parseInt(req.query.limit);
  params.limit = params.limit > 0 ? params.limit : config.storage.paging.limit;
  params.pages = Math.ceil(count / params.limit);
  if (params.page > params.pages) params.page = params.pages;
  params.offset = params.limit * (params.page - 1);
  params.querySuffix += ` LIMIT ${params.offset}, ${params.limit}`;
  return params;
}

exports.render = (req, dbName, table, columnsArray) => {
  const db = require('better-sqlite3')(config.storage.db[dbName].path);
  const columns = columnsArray.join(',');
  const filter = _filter(req, db, table);
  const count =  db.prepare(`
    SELECT COUNT(*) FROM ${table}${filter.where}
  `).pluck().get(filter.params);
  const paging = _paging(req, db, table, count);
  if (paging.error) {
    console.error('Paging error', paging);
    return {
      success: false,
      errors: ['An error occurred'],
    };
  }
  const records = db.prepare(`
    SELECT ${columns} FROM ${table}${filter.where}${paging.querySuffix}
  `).all(filter.params);
  return {
    success: true,
    errors: [],
    result: {
      records: records,
      page: paging.page,
      pages: paging.pages,
    },
  };
}