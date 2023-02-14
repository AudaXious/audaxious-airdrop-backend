const axios = require('axios');
const expect = require('chai').expect;
const assert = require('chai').assert;
const path = require('path');
const config = require(path.join(__dirname, '../src/config.js'));
const modules = require(path.join(__dirname, '../src/modules'));
let baseUrl = `http://127.0.0.1:${config.env.port}`;
const db = require('better-sqlite3')(config.app.storage.db.main.path);
describe('Api testing', function() {
  beforeEach(function() {

  })
  it('/', async () => {
    try {
      await axios.get(`${baseUrl}/`);
      throw new Error('An error occurred');
    } catch (error) {
      expect(error.response.status).to.equal(404);
    }
  });
  it('/config', async () => {
    let response = await axios.get(`${baseUrl}/config`);
    expect(response.data.success).to.be.false;
    expect(response.data.errors[0]).to.equal('Network is not found');

    response = await axios.get(`${baseUrl}/config?network=bsc`);
    expect(response.data.success).to.be.true;
  });
  it('authentification', async () => {
    let response = await axios.get(`${baseUrl}/auth/get-token`);
    const token = response.data.result.token;
    const signature = (await modules.signature.signMessage(response.data.result.message)).result.signature;
    response = await axios.post(`${baseUrl}/auth/login`, {
      signature,
      token
    });
    expect(response.data.success).to.be.true;
  });
  it('botometer check', async () => {
    let response = await axios.get(`${baseUrl}/auth/get-token`);
    const token = response.data.result.token;
    const signature = (await modules.signature.signMessage(response.data.result.message)).result.signature;

    response = await axios.post(`${baseUrl}/auth/login`, {
      signature,
      token
    });
    response = await axios.get(`${baseUrl}/twitter/bot-check`, {
      headers: {
        'X-ACCESS-TOKEN': response.data.result.authToken,
      },
      timeout: 1000 * 10,
    });
    expect(response.data.success).to.be.true;
  }).timeout(10000);
})