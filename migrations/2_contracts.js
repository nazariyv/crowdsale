const path = require("path");
const bignumber = require("bignumber.js");
var dotEnvPath = path.resolve("../.env.test");
require("dotenv").config({ path: dotEnvPath });

const MintableToken = artifacts.require("MintableToken");
const Crowdsale = artifacts.require("Crowdsale");

// accounts[0] by default is used to deploy the contracts
module.exports = (deployer, network, accounts) => {
  if (network !== "live") {
    deployer
      .deploy(
        MintableToken,
        bignumber(
          parseFloat(process.env.INITIAL_SUPPLY) *
            parseFloat(process.env.SCALE_FACTOR)
        ).toFixed()
      )
      .then(() => {
        return deployer.deploy(
          Crowdsale,
          process.env.RATE,
          accounts[0],
          MintableToken.address
        );
      });
  }
};
