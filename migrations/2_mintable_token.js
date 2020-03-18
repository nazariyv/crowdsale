const MintableToken = artifacts.require("MintableToken");
const loadEnv = require("../utils");
const bignumber = require("bignumber.js");

const deploy = async (deployer, network) => {
  const { INITIAL_SUPPLY, SCALE_FACTOR } = loadEnv(network);

  const mintableToken = await deployer.deploy(
    MintableToken,
    bignumber(INITIAL_SUPPLY * SCALE_FACTOR).toFixed()
  );

  return mintableToken;
};

module.exports = (deployer, network) =>
  deployer.then(async () => {
    return deploy(deployer, network);
  });
