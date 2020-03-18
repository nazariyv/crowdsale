const Migrations = artifacts.require("Migrations");
const MintableToken = artifacts.require("MintableToken");
const Crowdsale = artifacts.require("Crowdsale");
const loadEnv = require("../utils");

const deploy = async (deployer, network, accounts) => {
  const { RATE } = loadEnv(network);
  const developNetwork = network !== "live" && network !== "live-fork";
  let migrations = "";

  if (developNetwork) migrations = await Migrations.deployed();

  const mintableToken = await MintableToken.deployed();

  const crowdsale = await deployer.deploy(
    Crowdsale,
    RATE,
    accounts[0],
    mintableToken.address
  );

  if (developNetwork)
    console.log("migrations contract deployed at:", migrations.address);
  console.log("mintable token contract deployed at:", mintableToken.address);
  console.log("crowdsale token contract deployed at:", crowdsale.address);
  console.log(
    "don't forget to send some of the newly minted tokens to crowdsale contract"
  );

  return crowdsale;
};

module.exports = (deployer, network, accounts) =>
  deployer.then(async () => {
    return deploy(deployer, network, accounts);
  });
