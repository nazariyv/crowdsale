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
const CROWDSALE_TOKENS = 500.0;

contract("Crowdsale", async accounts => {
  beforeEach(async () => {
    mintableToken = await MintableToken.new(
      bignumber(INITIAL_SUPPLY * SCALE_FACTOR).toFixed()
    );
    crowdsale = await Crowdsale.new(RATE, accounts[0], mintableToken.address);
    tokenPrice = bignumber(1.0 / RATE);

    // top up crowdsale contract with our tokens, so that it can distribute these to buyers
    await mintableToken.transfer(
      crowdsale.address,
      bignumber(CROWDSALE_TOKENS * SCALE_FACTOR).toFixed()
    );
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

  it("correctly uses rate to distribute tokens", async () => {
    const tknPriceInEth = tokenPrice;
    const tknPriceInWei = web3.utils.toWei(tknPriceInEth.toFixed(), "ether");

    const tokenBalancePre = await mintableToken.balanceOf(accounts[0]);
    await crowdsale.send(tknPriceInWei);
    const tokenBalancePost = await mintableToken.balanceOf(accounts[0]);

    assert((tokenBalancePost - tokenBalancePre) / SCALE_FACTOR < 1 + ACCURACY);
  });

  it("sends correct number of tokens for non-whole numbers", async () => {
    const tknPriceInEth = tokenPrice;
    const tknPriceInWei = parseFloat(
      web3.utils.toWei(tknPriceInEth.toFixed(), "ether")
    );

    const tknsToReceive = 1.23456789;
    const tknsPrice = String(Math.round(tknsToReceive * tknPriceInWei));

    await crowdsale.send(tknsPrice, { from: accounts[1] });
    const tokenBalance = await mintableToken.balanceOf(accounts[1]);

    assert(tokenBalance - tknsToReceive * SCALE_FACTOR < ACCURACY);
  });

  it("correctly tracks wei raised", async () => {
    // also tests that multiple parties can participate
    let oneTokenWeiPrice = web3.utils.toWei(tokenPrice.toFixed(), "ether");
    const fiveTokensWeiPrice = web3.utils.toWei(
      String(5.0 * tokenPrice),
      "ether"
    );

    await crowdsale.send(oneTokenWeiPrice, { from: accounts[1] });
    const tokenBalanceAcc1 = await mintableToken.balanceOf(accounts[1]);
    assert(tokenBalanceAcc1 / SCALE_FACTOR < 1 + ACCURACY);

    oneTokenWeiPrice = parseFloat(oneTokenWeiPrice);
    let weiRaised = await crowdsale.weiRaised();
    assert(weiRaised - oneTokenWeiPrice < ACCURACY);

    await crowdsale.send(fiveTokensWeiPrice, { from: accounts[2] });
    const tokenBalanceAcc2 = await mintableToken.balanceOf(accounts[2]);
    assert(tokenBalanceAcc2 / SCALE_FACTOR < 5 + ACCURACY);

    weiRaised = await crowdsale.weiRaised();
    assert(weiRaised - 6 * oneTokenWeiPrice < ACCURACY);
  });

  it("buying when no more tokens are available", async () => {
    const tknPriceInWei = parseFloat(
      web3.utils.toWei(tokenPrice.toFixed(), "ether")
    );
    let overflowTokensPrice = String(
      Math.round((CROWDSALE_TOKENS + 1) * tknPriceInWei)
    );

    try {
      // this call should fail because the crowdsale smart contract does not have enough tokens
      // to send, and so the transaction will be reverted
      await crowdsale.send(overflowTokensPrice, { from: accounts[1] });
    } catch (err) {
      assert.equal(err.reason, "SafeERC20: low-level call failed");
    }
  });

  it("sends the wei raised to wallet", async () => {
    const tknPriceInWei = web3.utils.toWei(tokenPrice.toFixed(), "ether");

    const walletWeiBalancePre = await web3.eth.getBalance(accounts[0]);

    await crowdsale.send(tknPriceInWei, { from: accounts[1] });
    await crowdsale.send(String(5.0 * parseFloat(tknPriceInWei)), {
      from: accounts[1]
    });

    const walletWeiBalancePost = await web3.eth.getBalance(accounts[0]);

    assert(
      walletWeiBalancePost - walletWeiBalancePre <
        bignumber(web3.utils.toWei("0.0006", "ether")) + bignumber(ACCURACY)
    );
  });
});
