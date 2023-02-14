const path = require("path");
const config = require(path.join(__dirname, '../config.js')).app;
const modules = require(path.join(__dirname, '../modules'));

exports.checkActivity = async (params) => {
  const activity = params.eventData.private.activities[params.activityId - 1];
  let actionsCompletingData = params.actionsCompletingData;
  let completed = true;
  if (!actionsCompletingData.default) actionsCompletingData.default = {};
  for (let i = 0; i < config.activityData.defaultActions.length; i ++) {
    if (!actionsCompletingData.default[i]) {
      actionsCompletingData.default[i] = {};
    } else if (actionsCompletingData.default[i].completed) {
      continue;
    }
    const action = config.activityData.defaultActions[i];
    if (typeof modules.actions[action.method] !== 'function') {
      completed = false;
      actionsCompletingData.default[i].completed = false;
      actionsCompletingData.default[i].comments = 'Invalid method';
      continue;
    }
    const result = await modules.actions[action.method]({
      data: action.data,
      user: params.user,
      network: params.network
    });
    if (!result.completed) completed = false;
    actionsCompletingData.default[i].completed = !!result.completed;
    actionsCompletingData.default[i].comments = result.comments;
  }
  if (!actionsCompletingData.custom) actionsCompletingData.custom = {};
  const actions = Array.isArray(activity.actions) ? activity.actions : [];
  for (let i = 0; i < actions.length; i ++) {
    if (!actionsCompletingData.custom[i]) {
      actionsCompletingData.custom[i] = {};
    } else if (actionsCompletingData.custom[i].completed) {
      continue;
    }
    const action = actions[i];
    if (typeof modules.actions[action.method] !== 'function') {
      completed = false;
      actionsCompletingData.custom[i].completed = false;
      actionsCompletingData.custom[i].comments = 'Invalid method';
      continue;
    }
    const result = await modules.actions[action.method]({
      data: action.data,
      user: params.user,
      network: params.network
    });
    if (!result.completed) completed = false;
    actionsCompletingData.custom[i].completed = !!result.completed;
    actionsCompletingData.custom[i].comments = result.comments;
  }
  const result = { actionsCompletingData };
  if (completed) {
    result.signature = await modules.signature.signActivity(
      params.user.address, params.eventId, params.activityId
    );
  }
  return result;
}