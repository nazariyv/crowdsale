const path = require("path");
var dotEnvPath = path.resolve("../.env.test");
require("dotenv").config({ path: dotEnvPath });
const Crowdsale = artifacts.require("Crowdsale");

contract("Crowdsale", async accounts => {
  it("deploys", async () => {
    const instance = await Crowdsale.deployed();
    assert.notEqual(instance.address, null);
  });
});
