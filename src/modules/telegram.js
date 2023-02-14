const path = require("path");
const axios = require("axios");
const config = require(path.join(__dirname, `../config.js`)).app;

exports.send = async (method, data) => {
  const response = await axios({
    method: 'post',
    url: `https://api.telegram.org/bot${config.api.telegram.token}/${method}`,
    data: data
  });
  if (!response || !response.data || !response.data.ok) {
    console.error('Telegram API request error', method, data, response.data);
  }
}

exports.sendMessage = async (chat_id, text) => {
  const data = {
    chat_id,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: 1,
  };

  await exports.send('sendMessage', data);
}
