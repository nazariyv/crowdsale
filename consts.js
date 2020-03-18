const path = require("path");

require("dotenv").config({ path: path.resolve("./.env") });

const INITIAL_SUPPLY = parseFloat(process.env.INITIAL_SUPPLY);
const SCALE_FACTOR = parseFloat(process.env.SCALE_FACTOR);
const ZERO_ADDRESS = process.env.ZERO_ADDRESS;
const RATE = parseFloat(process.env.RATE);

module.exports = {
  INITIAL_SUPPLY,
  SCALE_FACTOR,
  ZERO_ADDRESS,
  RATE
};
