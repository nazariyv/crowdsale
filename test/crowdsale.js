const path = require("path");
var dotEnvPath = path.resolve("../.env.test");
require("dotenv").config({ path: dotEnvPath });

const MintableToken = artifacts.require("MintableToken");
const Crowdsale = artifacts.require("Crowdsale");
const { RATE, INITIAL_SUPPLY, SCALE_FACTOR } = require("../consts.test");
const bignumber = require("bignumber.js");

contract("Crowdsale", async accounts => {
  beforeEach(async () => {
    mintableToken = await MintableToken.new(
      bignumber(INITIAL_SUPPLY * SCALE_FACTOR).toFixed()
    );
    crowdsale = await Crowdsale.new(RATE, accounts[0], mintableToken.address);
  });

  it("deploys", async () => {
    assert.notEqual(crowdsale.address, null);
  });

  it("sells the correct token", async () => {
    assert.equal(await crowdsale.token(), mintableToken.address);
  });

  it("sets the correct ether receiver wallet", async () => {
    assert.equal(await crowdsale.wallet(), accounts[0]);
  });

  it("sets the correct rate", async () => {
    let rate = await crowdsale.rate();
    rate = rate.toNumber();
    assert.equal(await rate, RATE);
  });

  // what happens when attempting to buy when no more tokens remain
});
