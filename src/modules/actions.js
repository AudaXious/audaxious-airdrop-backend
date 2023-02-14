const path = require('path');
const config = require(path.join(__dirname, '../config.js')).app;
const modules = require(path.join(__dirname, '../modules'));

exports.botCheck = async (params) => {
  if (!params.user.twitterData) {
    return {
      completed: false,
      comments: 'Twitter account is not bound to this address'
    }
  }
  const score = params.data.score > 0 ? params.data.score : 0;
  let twitterData = {};
  try {
    twitterData = JSON.parse(params.user.twitterData);
    if (!twitterData.userId) throw new Error('Twitter data is not valid');
  } catch (e) {
    return {
      completed: false,
      comments: 'Twitter data in user record is not valid',
    }
  }
  if (twitterData.botRating) {
    const completed = twitterData.botRating > score;
    return {
      completed,
      comments: completed
        ? ''
        : 'Automated activity discovered fot the Twitter account bound to this address',
    }
  }
  const result = await modules.twitter.botRating({twitterData, user: params.user});
  if (!result.success || !result.result || !result.result.botRating) {
    return {
      completed: false,
      comments: 'botRating request failed',
    }
  }
  const completed = result.result.botRating > score;
  return {
    completed,
    comments: completed
      ? ''
      : 'Automated activity discovered fot the Twitter account bound to this address',
  }
};

exports.telegramCheck = async (params) => {
  const completed = !!params.user.telegramId;
  return {
    completed,
    comments: completed ? '' : 'Telegram account is not bound to this address',
  }
};

exports.testCompleted = async (params) => {
  return {
    completed: true,
    comments: '',
  }
};

exports.testNotCompleted = async (params) => {
  return {
    completed: false,
    comments: `Test 2 is not completed, userAddress: ${params.user.address}, network: ${params.network}`,
  }
};