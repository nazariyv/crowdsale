const Migrations = artifacts.require("Migrations");
const MintableToken = artifacts.require("MintableToken");
const Crowdsale = artifacts.require("Crowdsale");

const path = require("path");
const bignumber = require("bignumber.js");
var dotEnvPath = path.resolve("../.env.test");
require("dotenv").config({ path: dotEnvPath });
const { INITIAL_SUPPLY, SCALE_FACTOR, RATE } = require("../consts.test");

// TODO: add live and make DRY
module.exports = (deployer, network, accounts) => {
  if (network !== "live") {
    deployer.then(async () => {
      const migrations = await deployer.deploy(Migrations);
      console.log("migrations contract deployed at:", migrations.address);

      const mintableToken = await deployer.deploy(
        MintableToken,
        bignumber(INITIAL_SUPPLY * SCALE_FACTOR).toFixed()
      );
      console.log(
        "mintable token contract deployed at:",
        mintableToken.address
      );

      const crowdsale = await deployer.deploy(
        Crowdsale,
        RATE,
        accounts[0],
        mintableToken.address
      );
      console.log("crowdsale token contract deployed at:", crowdsale.address);
    });
  }
};
