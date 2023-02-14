const fs = require('fs');

const modules = fs.readdirSync(__dirname);
modules.forEach(item => {
  if (item === 'index.js' || item.slice(-3) !== '.js') return;
  exports[item.slice(0, -3)] = require(`${__dirname}/${item}`);
});