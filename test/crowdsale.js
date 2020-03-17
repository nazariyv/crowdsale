const path = require("path");
var dotEnvPath = path.resolve("../.env.test");
require("dotenv").config({ path: dotEnvPath });

const MintableToken = artifacts.require("MintableToken");
const Crowdsale = artifacts.require("Crowdsale");
const {
  RATE,
  INITIAL_SUPPLY,
  SCALE_FACTOR,
  ACCURACY
} = require("../consts.test");
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

  it("correctly tracks wei raised", async () => {
    const tokenBalance = await mintableToken.balanceOf(crowdsale.address);
    assert(tokenBalance < ACCURACY);

    // top up crowdsale contract with our tokens
    await mintableToken.transfer(
      crowdsale.address,
      bignumber(500 * SCALE_FACTOR).toFixed(),
      { from: accounts[0] }
    );

    const oneTokenEthPrice = web3.utils.toWei(
      bignumber(1.0 / RATE).toFixed(),
      "ether"
    );
    const fiveTokenEthPrice = web3.utils.toWei(
      bignumber((1.0 / RATE) * 5).toFixed(),
      "ether"
    );

    await crowdsale.send(oneTokenEthPrice, { from: accounts[1] });
    const tokenBalanceAcc1 = await mintableToken.balanceOf(accounts[1]);
    assert(tokenBalanceAcc1 / SCALE_FACTOR - 1 < ACCURACY);

    await crowdsale.send(fiveTokenEthPrice, { from: accounts[2] });
    const tokenBalanceAcc2 = await mintableToken.balanceOf(accounts[2]);
    assert(tokenBalanceAcc2 / SCALE_FACTOR - 5 < ACCURACY);
  });

  it("correctly uses rate", async () => {});

  it("allows multiple parties to participate", async () => {});

  // what happens when attempting to buy when no more tokens remain
  // buy tokens with the buyTokens method
  // buy tokens simply by sending the value and thus triggering the fallback
});
