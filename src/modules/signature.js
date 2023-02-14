const path = require('path');
const config = require(path.join(__dirname, '../config.js')).app;
const jwt = require('jsonwebtoken');
const randomNumber = require('random-number-csprng');
const ethers = require('ethers');
const md5 = require('md5');
const db = require('better-sqlite3')(config.storage.db.main.path);

exports.verify = (params) => {
  if (!params.signature || !params.token) {
    return {
      success: false,
      errors: ['Missed required fields (signature, token)'],
    }
  }
  try {
    const data = jwt.verify(params.token, config.jwtKey);
    try {
      const address = ethers.utils.verifyMessage(data.message, params.signature).toLowerCase();
      const options = {
        expiresIn: config.lifeTime.login,
      };
      let userRecord = db.prepare('SELECT * FROM users WHERE address = :address')
        .get({address: address});
      if (!userRecord) {
        const now = Math.round(Date.now() / 1000);
        const result = db.prepare(
          `INSERT INTO users (address, createdAt) VALUES (:address, :createdAt)`
        )
          .run({address: address, createdAt: now});
        userRecord = {
          id: result.lastInsertRowid,
          address: address,
        }
      }
      const token = jwt.sign(userRecord, config.jwtKey, options);
      return {
        success: true,
        result: {
          authToken: token,
        },
      }
    } catch (error) {
      console.error('Signature error', error);
      return {
        success: false,
        errors: ['Invalid signature'],
      };
    }
  } catch (error) {
    console.error('JWT verify error', error);
    return {
      success: false,
      errors: ['Invalid token'],
    };
  }
}

exports.getMessage = async() => {
  return md5((await randomNumber(10000000, 99999999)).toString());
}

exports.getToken = async() => {
  const message = await exports.getMessage();
  const options = {
    expiresIn: config.lifeTime.message,
  };
  const token = jwt.sign({message: message}, config.jwtKey, options);
  return {
    success: true,
    result: {
      message: message,
      token: token,
    }
  };
}

exports.signMessage = async(message) => {
  const signer = new ethers.Wallet(config.signers.production.privateKey);
  return {
    success: true,
    result: {
      signature: await signer.signMessage(message),
    }
  };
}

exports.signAirdrop = async(address) => {
  const signer = new ethers.Wallet(config.signers.production.privateKey);

  let abiCoder = new ethers.utils.AbiCoder();
  let message = abiCoder.encode(
    ["address"],
    [address]
  );
  let hashedMessage = ethers.utils.keccak256(message);
  let messageHashBinary = ethers.utils.arrayify(hashedMessage);
  const signature = await signer.signMessage(messageHashBinary);

  return signature;
}