const Migrations = artifacts.require("Migrations");

const deploy = async (deployer, network, _) => {
  let migrations = "";
  if (network !== "live" && network !== "live-fork") {
    migrations = await deployer.deploy(Migrations);
  }
};

module.exports = (deployer, network, accounts) =>
  deployer.then(async () => {
    return deploy(deployer, network, accounts);
  });
