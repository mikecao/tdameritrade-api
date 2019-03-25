const fs = require('fs');
const path = require('path');

const key = fs.readFileSync(path.resolve(__dirname, './config/key.pem'));
const cert = fs.readFileSync(
  path.resolve(__dirname, './config/certificate.pem')
);

module.exports = {
  key,
  cert,
};
