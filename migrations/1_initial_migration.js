const Migrations = artifacts.require("Migrations");
const MintableToken = artifacts.require("MintableToken");
const Crowdsale = artifacts.require("Crowdsale");

const path = require("path");
const bignumber = require("bignumber.js");

const deploy = async (deployer, network, accounts) => {
  let envFile = "";
  let constsFile = "";

  if (network !== "live") {
    envFile = "../.env.test";
    constsFile = "../consts.test";
  } else {
    envFile = "../.env";
    constsFile = "../consts";
  }

  const dotEnvPath = path.resolve(envFile);
  require("dotenv").config({ path: dotEnvPath });
  const { INITIAL_SUPPLY, SCALE_FACTOR, RATE } = require(constsFile);

  let migrations = "";
  if (network !== "live") {
    migrations = await deployer.deploy(Migrations);
  }

  const mintableToken = await deployer.deploy(
    MintableToken,
    bignumber(INITIAL_SUPPLY * SCALE_FACTOR).toFixed()
  );

  const crowdsale = await deployer.deploy(
    Crowdsale,
    RATE,
    accounts[0],
    mintableToken.address
  );

  if (network !== "live") {
    console.log("migrations contract deployed at:", migrations.address);
  }
  console.log("mintable token contract deployed at:", mintableToken.address);
  console.log("crowdsale token contract deployed at:", crowdsale.address);
  console.log(
    "don't forget to send some of the newly minted tokens to crowdsale contract"
  );
};

module.exports = (deployer, network, accounts) =>
  deployer.then(async () => {
    return deploy(deployer, network, accounts);
  });
