const express = require('express');
const path = require('path');
const router = express.Router();
const api = require(path.join(__dirname, './api.js'));
router.use('/api', api);

// catch 404 and forward to error handler
router.use((req, res, next) => {
  res.status(404);
  if (req.accepts('json')) {
    res.send({ success: false, errors: ['404 Not found'] });
    return;
  }
  res.send('404 Not found');
});

// error hadnling
router.use((err, req, res, next) => {
  let errStatus = err.status || 500;
  res.status(errStatus);
  console.error('App error', err);
  if (req.accepts('json')) {
    res.send({ success: false, errors: [`${errStatus} + An error occurred`] });
    return;
  }
  res.send(`${errStatus} + An error occurred`);
});

module.exports = router;