const path = require("path");
const checkEnvironment = require(path.join(__dirname, './modules/checkEnvironment.js'))
  .default;
if (!checkEnvironment()) {
  throw new Error('Initial check fail');
}
const express = require('express');
const app = express();
const session = require('express-session')
const bodyParser = require('body-parser');
const routes = require(path.join(__dirname, './routes'));
const config = require(path.join(__dirname, './config.js'));
const cors = require('cors');
app.use(cors({origin: '*'}));
app.use(bodyParser.json());
const port = config.env.port;
const sessionConfig = {
  user: null,
  tokenSecret: null,
  secret: config.app.session.secret,
  resave: true,
  saveUninitialized: true
}

app.use(session(sessionConfig));
app.use('/', routes);

if (!port) throw('Empty port const');
app.listen(port, (error) => {
  if (error) {
    return console.error('App listen fail', error);
  }
  console.log(`server is listening on ${port}`);
});