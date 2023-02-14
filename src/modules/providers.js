const path = require("path");
const config = require(path.join(__dirname, '../config.js')).app;
const ethers = require("ethers");
const providers = {};
const timestamps = {};

exports.default = (network) => {
  if (!config.networks[network]) return null;
  const now = Math.round(Date.now() / 1000);
  if (!timestamps[network]) timestamps[network] = now;
  if (!providers[network] || now - timestamps[network] > config.lifeTime.cache.provider) {
    timestamps[network] = now;
    providers[network] = new ethers.providers.StaticJsonRpcProvider(
      config.networks[network].rpc
    );
  }
  return providers[network];
}