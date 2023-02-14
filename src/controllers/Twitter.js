const path = require('path');
const config = require(path.join(__dirname, '../config.js')).app;
const modules = require(path.join(__dirname, '../modules'));
const db = require('better-sqlite3')(config.storage.db.main.path);
const LoginWithTwitter = require('login-with-twitter');
const tw = new LoginWithTwitter({
  consumerKey: config.api.twitter.key,
  consumerSecret: config.api.twitter.secret,
  callbackUrl: `${config.appUrl}${config.api.twitter.callbackUrl}`
});

exports.auth = async (req, res) => {
  tw.login((err, tokenSecret, url) => {
    if (err) {
      console.error(err);
      return res.send({
        success: false,
        errors: ['An error occurred'],
      });
    }

    req.session.tokenSecret = tokenSecret;
    req.session.address = req.user.address;

    res.send({
      success: true,
      result: {
        redirectTo: url,
      }
    });
  });
}

exports.callback = async (req, res) => {
  tw.callback({
    oauth_token: req.query.oauth_token,
    oauth_verifier: req.query.oauth_verifier
  }, req.session.tokenSecret, (err, twitterUser) => {
    if (err) {
      console.error(err);
      return res.send({
        success: false,
        errors: ['An error occurred'],
      });
    }
    const address = req.session.address;
    delete req.session.tokenSecret;
    delete req.session.address;
    const record = db.prepare('SELECT id, twitterData FROM users WHERE address = :address')
      .get({
        address: address
      });
    if (!record) {
      console.error('Twitter auth request error');
      return res.redirect(`/test?message=${encodeURI('An error occurred')}&status=danger`);
    }
    if (record.twitterData) {
      return res.redirect(`/test?message=${encodeURI('Your address is already bound to the Twitter account.')}&status=danger`);
    }
    if (
      db.prepare('SELECT id FROM users WHERE twitterData LIKE :twitterData')
        .get({twitterData: `%"userId":"${twitterUser.userId}"%`})
    ) {
      return res.redirect(`/test?message=${encodeURI('This twitter account is already bound to another address.')}&status=danger`);
    }
    db.prepare('UPDATE users SET twitterData = :twitterData WHERE id = :id')
      .run({
        twitterData: JSON.stringify(twitterUser),
        id: record.id,
      });

    // Redirect to whatever route that can handle your new Twitter login user details!
    res.redirect(`/test?message=${encodeURI(`Twitter account @${twitterUser.userName} was bound to your address ${address}`)}&status=success`);
  });
}

exports.unbind = async (req, res) => {
  const record = db.prepare(
    `SELECT * FROM users WHERE address = :address`
  )
    .get({
      address: req.user.address,
    });
  if (!record) {
    console.error('controllers.Twitter.unbind User record does not exist');
    throw new Error('An error occurred');
  }
  db.prepare(
    `UPDATE users SET twitterData = NULL WHERE id = :id`
  )
    .run({
      id: record.id
    });
  return res.send({
    success: true,
    message: `Your Twitter account was unbound from your address ${record.address}`,
  });
}

exports.botCheck = async (req, res) => {
  const record = db.prepare(
    `SELECT * FROM users WHERE address = :address`
  )
    .get({
      address: req.user.address,
    });
  if (!record) {
    console.error('controllers.Twitter.unbind User record does not exist');
    throw new Error('An error occurred');
  }
  if (!record.twitterData) {
    return res.send({
      success: false,
      errors: [`Twitter account is not bound to your address ${req.user.address}`],
    });
  }
  let twitterData;
  try {
    twitterData = JSON.parse(record.twitterData);
  } catch (e) {
    console.error('controllers.Twitter.check twitterData parsing error');
    throw new Error('An error occurred');
  }
  if (twitterData.botRating) {
    return res.send({
      success: true,
      result: {
        botRating: twitterData.botRating
      },
    });
  }
  const result = await modules.twitter.botRating({record, twitterData});
  if (!result.success) {
    console.error('controllers.Twitter.check', result);
    throw new Error('An error occurred');
  }
  return res.send({
    success: true,
    result: {
      botRating: result.result.botRating,
    },
  });
}
