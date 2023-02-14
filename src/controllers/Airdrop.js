const path = require('path');
const modules = require(path.join(__dirname, '../modules'));
const config = require(path.join(__dirname, '../config.js')).app;
const db = require('better-sqlite3')(config.storage.db.main.path);
const winners = ['cut3an1m3', 'robertrose1991', 'ahallo1990', 'rahul66267247', 'sai999kiran999', 'badboykincry', 'foxrelaxed', 'promsziky10', 'digital_nfts3', 'zulchair3', 'avewoke23', 'eagle_roher', 'dringa8', 'carteirakm', 'leepinggoh', 'bossofficial007', 'ae_tit', 'aniksm98', 'blessings_nfts', 'rajencrypto', 'shashitpatel', 'virusonton', 'arsenal79172545', 'jonatha59738347', 'pauldex_31', 'al2a87', 'olagbadunp', 'alexfcryptoleg', 'whyunhf1', 'prizeehunter', 'james80748083', 'zaktizarnaz', 'arifmaolan', 'jimhasa17591495', 'philipyeoh931', 'ral58068876', 'scaarlethopkins', 'cris__u', 'funky_funky22', 'nihal405994871', 'akshaykumar', 'lukaevans_1', 'mhmmduvysylmz', 'adindadwi5_', 'aishibaeth', 'farhans_stories', 'arieoted', 'harunhariss', 'hmgerardo', 'kraman434'];

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
  if (winners.indexOf(twitterData.userName.toLowerCase()) > -1) {
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