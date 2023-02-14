const path = require("path");
const config = require(path.join(__dirname, `../config.js`)).app;
const db = require('better-sqlite3')(config.storage.db.main.path);
const { TwitterApi } = require('twitter-api-v2');
const axios = require("axios");

exports.searchTweets = async (params) => {
  const record = db.prepare(
    'SELECT id, twitterData FROM users WHERE address = :address'
  ).get({
    address: params.address
  });
  if (!record) {
    console.error('modules.twitter.searchTweets User record is not found error');
    throw new Error('User record is not found');
  }
  if (!record.twitterData) {
    throw new Error(`Twitter account is not bound to the address ${params.address}`);
  }
  let twitterData;
  try {
    twitterData = JSON.parse(record.twitterData);
  } catch (e) {
    throw new Error('An error occurred');
  }
  if (!twitterData) throw new Error('An error occurred');
  const client = new TwitterApi({
    appKey: config.api.twitter.key,
    appSecret: config.api.twitter.secret,
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: twitterData.userToken,
    accessSecret: twitterData.userTokenSecret,
  });
  const tweets = await client.v2.userTimeline(twitterData.userId, { exclude: 'replies' });
  const result = {
    success: true,
    result: {
      tweets: [],
    }
  }
  for (const tweet of tweets) {
    result.result.tweets.push(tweet);
  }
  return result;
}

exports.botRating = async (params) => {
  const client = new TwitterApi({
    appKey: config.api.twitter.key,
    appSecret: config.api.twitter.secret,
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want an app-only client (see below)
    accessToken: params.twitterData.userToken,
    accessSecret: params.twitterData.userTokenSecret,
  });
  const timeline = await client.v1.userTimeline(params.twitterData.userId, { exclude: 'replies' });
  const mentionTimeline = await client.v2.userMentionTimeline(params.twitterData.userId, {});
  const data = {
    mentions: mentionTimeline.tweets,
    timeline: [],
    user: {
      "id_str": params.twitterData.userId,
      "screen_name": params.twitterData.userName
    }
  };

  for (const tweet of timeline) {
    tweet.text = tweet.full_text;
    data.timeline.push(tweet);
  }

  if (!(data.timeline.length > 0)) {
    return {
      success: true,
      result: {
        botRating: null,
      }
    };
  }

  const options = {
    method: 'POST',
    url: 'https://botometer-pro.p.rapidapi.com/4/check_account',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '2dbaf5bf15msh9d9047b8967c816p11b992jsn7479ce6f2730',
      'X-RapidAPI-Host': 'botometer-pro.p.rapidapi.com'
    },
    data: JSON.stringify(data),
  };

  const response = await axios.request(options);
  if (!response.data.cap) {
    console.error(`modules.twitter.botRating, request to botometer API failed, record id = ${params.user.id}`, response.data);
    return {
      success: false,
      errors: ['An error occurred']
    };
  }
  params.twitterData.botometer = response.data;
  params.twitterData.botRating = response.data.cap.english;
  db.prepare('UPDATE users SET twitterData = :twitterData WHERE id = :id')
    .run({
      twitterData: JSON.stringify(params.twitterData),
      id: params.user.id,
    });
  return {
    success: true,
    result: {
      botRating: response.data.cap.english,
    },
  }
}
