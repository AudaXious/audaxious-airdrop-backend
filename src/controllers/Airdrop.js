const path = require('path');
const modules = require(path.join(__dirname, '../modules'));
const config = require(path.join(__dirname, '../config.js')).app;
const db = require('better-sqlite3')(config.storage.db.main.path);

exports.get = async(req, res) => {
  const address = req.user.address;
  const user = db.prepare('SELECT * FROM users WHERE address = :address')
    .get({
      address,
    });
  if (user.signature) {
    return res.send({
      success: true,
      result: {
        signature: user.signature,
      },
      message: {
        text: 'Congratulations, your twitter account has won',
        status: 'success',
      },
    });
  }
  if (!user.twitterData) {
    return res.send({
      success: true,
      result: {
        twitterConnect: true,
      },
    });
  }

  let twitterData = {};
  try {
    twitterData = JSON.parse(user.twitterData);
  } catch (e) {
    console.error(`Controllers.Airdrop JSON parse data error, user record id ${user.id}`);
    throw new Error('An error occurred');
  }
  if (config.airdrop.winners.indexOf(twitterData.userName.toLowerCase()) > -1) {
    const signature = await modules.signature.signAirdrop(address);
    console.log(signature, address);
    db.prepare('UPDATE users SET signature = :signature WHERE address = :address')
      .run({ signature, address });
    return res.send({
      success: true,
      result: {
        signature,
      },
      message: {
        text: 'Congratulations, your twitter account has won',
        status: 'success',
      },
    });
  }
  return res.send({
    success: true,
    result: {},
    message: {
      text: 'Your twitter account has not won',
      status: 'info',
    },
  });
}