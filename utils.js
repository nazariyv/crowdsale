const bignumber = require("bignumber.js");

const toEther = wei => {
  return bignumber(parseFloat(wei) / 10 ** 18).toFixed();
};

const toWei = ether => {
  return bignumber(parseFloat(ether) * 10 ** 18).toFixed();
};

module.exports = {
  toEther,
  toWei
};
