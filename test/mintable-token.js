const path = require("path");
var dotEnvPath = path.resolve("../.env.test");
require("dotenv").config({ path: dotEnvPath });
const MintableToken = artifacts.require("MintableToken");
const bignumber = require("bignumber.js");

const {
  INITIAL_SUPPLY,
  SCALE_FACTOR,
  ZERO_ADDRESS,
  ACCURACY,
  PLACEHOLDER_TKNBITS,
  OVERFLOW_UINT256
} = require("../consts.test");

contract("MintableToken", async accounts => {
  beforeEach(async () => {
    mintableToken = await MintableToken.new(
      bignumber(INITIAL_SUPPLY * SCALE_FACTOR).toFixed()
    );
  });

  it("deploys", async () => {
    assert.notEqual(mintableToken.address, null);
  });

  it("deposits initial supply to deployer's contract", async () => {
    let tokenBalanceOfDeployer = await mintableToken.balanceOf(accounts[0]);
    assert(tokenBalanceOfDeployer / SCALE_FACTOR - INITIAL_SUPPLY < ACCURACY);
  });

  it("allows deployer to mint more tokens", async () => {
    let deployerPreBalance = await mintableToken.balanceOf(accounts[0]);
    deployerPreBalance /= SCALE_FACTOR;
    assert(deployerPreBalance - INITIAL_SUPPLY < ACCURACY);

    const additionalSupply = 20000 * SCALE_FACTOR;
    await mintableToken.mint(
      accounts[0],
      bignumber(additionalSupply).toFixed()
    );

    const postMintBalance = await mintableToken.balanceOf(accounts[0]);
    assert(
      postMintBalance - (deployerPreBalance * SCALE_FACTOR + additionalSupply) <
        ACCURACY
    );
  });

  it("prohibits non-deployers from minting more tokens", async () => {
    await accounts.slice(1).forEach(async acc => {
      try {
        await mintableToken.mint(
          acc,
          bignumber(10000 * SCALE_FACTOR).toFixed(),
          {
            from: acc
          }
        );
      } catch (err) {
        assert.equal(
          err.reason,
          "MinterRole: caller does not have the Minter role"
        );
      }
    });
  });

  it("is mint overflow resistant", async () => {
    // uint256 => max number is 2^256 - 1
    // 0xf   = 15   (2^4 - 1)
    // 0xff  = 255  (2^4 * 2^4 - 1) or (2^8 - 1)
    // 0xfff = 4095 (2^12 -1)
    // right hand side grows by a factor of 2^4 each time
    // 1 hex value representes 16 bits or 2 bytes
    // "0x" + "f...256/4 times...f" will overflow
    try {
      await mintableToken.mint(accounts[0], OVERFLOW_UINT256);
    } catch (err) {
      assert.equal(err.reason, "SafeMath: addition overflow");
    }
  });

  it("won't mint to zero address", async () => {
    try {
      await mintableToken.mint(
        ZERO_ADDRESS,
        bignumber(10000 * SCALE_FACTOR).toFixed()
      );
    } catch (err) {
      assert.equal(err.reason, "ERC20: mint to the zero address");
    }
  });

  it("prohibits non-deployers from transfering tokens", async () => {
    // other accs don't have any t0kens
    await accounts.slice(1).forEach(async acc => {
      try {
        await mintableToken.transfer(accounts[0], PLACEHOLDER_TKNBITS, {
          from: acc
        });
      } catch (err) {
        assert.equal(err.reason, "ERC20: transfer amount exceeds balance");
      }
    });
  });

  it("allows deployer to transfer tokens", async () => {
    const senderPreBalance = await mintableToken.balanceOf(accounts[0]);
    const receiverPreBalance = await mintableToken.balanceOf(accounts[1]);

    await mintableToken.transfer(accounts[1], PLACEHOLDER_TKNBITS);

    const senderPostBalanace = await mintableToken.balanceOf(accounts[0]);
    const receiverPostBalance = await mintableToken.balanceOf(accounts[1]);

    assert(
      senderPreBalance - senderPostBalanace < PLACEHOLDER_TKNBITS + ACCURACY
    );
    assert(
      receiverPostBalance - receiverPreBalance < PLACEHOLDER_TKNBITS + ACCURACY
    );
  });

  it("prohibits deployer from transfering tokens to zero address", async () => {
    try {
      await mintableToken.transfer(ZERO_ADDRESS, PLACEHOLDER_TKNBITS);
    } catch (err) {
      assert.equal(err.reason, "ERC20: transfer to the zero address");
    }
  });

  it("prohinits deployer from transfering more than the balance", async () => {
    const balance = await mintableToken.balanceOf(accounts[0]);

    try {
      await mintableToken.transfer(accounts[1], balance + PLACEHOLDER_TKNBITS);
    } catch (err) {
      assert.equal(err.reason, "ERC20: transfer amount exceeds balance");
    }
  });
});
