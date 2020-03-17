const path = require("path");
var dotEnvPath = path.resolve("./.env.test");
require("dotenv").config({ path: dotEnvPath });
const bignumber = require("bignumber.js");

const INITIAL_SUPPLY = parseFloat(process.env.INITIAL_SUPPLY);
const SCALE_FACTOR = parseFloat(process.env.SCALE_FACTOR);
const ZERO_ADDRESS = process.env.ZERO_ADDRESS;
const ACCURACY = 10 ** -4;
const PLACEHOLDER_TKNBITS = 1;
const OVERFLOW_UINT256 = bignumber("0x" + "f".repeat(64)).toFixed();
const RATE = parseFloat(process.env.RATE);

module.exports = {
  INITIAL_SUPPLY,
  SCALE_FACTOR,
  ZERO_ADDRESS,
  ACCURACY,
  PLACEHOLDER_TKNBITS,
  OVERFLOW_UINT256,
  RATE
};
