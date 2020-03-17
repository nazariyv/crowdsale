const path = require("path");
var dotEnvPath = path.resolve("../.env.test");
require("dotenv").config({ path: dotEnvPath });
const MintableToken = artifacts.require("MintableToken");
const bignumber = require("bignumber.js");

const INITIAL_SUPPLY = parseFloat(process.env.INITIAL_SUPPLY);
const SCALE_FACTOR = parseFloat(process.env.SCALE_FACTOR);
const ZERO_ADDRESS = process.env.ZERO_ADDRESS;
const ACCURACY = 10 ** -4;
const PLACEHOLDER_TKNBITS = 1;
const OVERFLOW_UINT256 = bignumber("0x" + "f".repeat(64)).toFixed();

contract("MintableToken", async accounts => {
  it("should deploy", async () => {
    let instance = await MintableToken.deployed();
    assert.notEqual(instance.address, null);
  });

  it("should deposit initial supply to deployer's contract", async () => {
    let instance = await MintableToken.deployed();
    let tokenBalanceOfDeployer = await instance.balanceOf(accounts[0]);
    assert(tokenBalanceOfDeployer / SCALE_FACTOR - INITIAL_SUPPLY < ACCURACY);
  });

  it("should allow deployer to mint more tokens", async () => {
    let instance = await MintableToken.deployed();
    let deployerPreBalance = await instance.balanceOf(accounts[0]);
    deployerPreBalance /= SCALE_FACTOR;
    assert(deployerPreBalance - INITIAL_SUPPLY < ACCURACY);

    const additionalSupply = 20000 * SCALE_FACTOR;
    await instance.mint(accounts[0], bignumber(additionalSupply).toFixed());

    const postMintBalance = await instance.balanceOf(accounts[0]);
    assert(
      postMintBalance - (deployerPreBalance * SCALE_FACTOR + additionalSupply) <
        ACCURACY
    );
  });

  it("should disallow non-deployers to mint more tokens", async () => {
    let instance = await MintableToken.deployed();
    await accounts.slice(1).forEach(async acc => {
      try {
        await instance.mint(acc, bignumber(10000 * SCALE_FACTOR).toFixed(), {
          from: acc
        });
      } catch (err) {
        assert.equal(
          err.reason,
          "MinterRole: caller does not have the Minter role"
        );
      }
    });
  });

  it("mint is overflow resistant", async () => {
    let instance = await MintableToken.deployed();
    // uint256 => max number is 2^256 - 1
    // 0xf   = 15   (2^4 - 1)
    // 0xff  = 255  (2^4 * 2^4 - 1) or (2^8 - 1)
    // 0xfff = 4095 (2^12 -1)
    // right hand side grows by a factor of 2^4 each time
    // 1 hex value representes 16 bits or 2 bytes
    // "0x" + "f...256/4 times...f" will overflow
    try {
      await instance.mint(accounts[0], OVERFLOW_UINT256);
    } catch (err) {
      assert.equal(err.reason, "SafeMath: addition overflow");
    }
  });

  it("can't mint to zero address", async () => {
    let instance = await MintableToken.deployed();
    try {
      await instance.mint(
        ZERO_ADDRESS,
        bignumber(10000 * SCALE_FACTOR).toFixed()
      );
    } catch (err) {
      assert.equal(err.reason, "ERC20: mint to the zero address");
    }
  });

  it("should disallow non-deployers to transfer tokens", async () => {
    // other accs don't have any t0kens
    const instance = await MintableToken.deployed();

    await accounts.slice(1).forEach(async acc => {
      try {
        await instance.transfer(accounts[0], PLACEHOLDER_TKNBITS, {
          from: acc
        });
      } catch (err) {
        assert.equal(err.reason, "ERC20: transfer amount exceeds balance");
      }
    });
  });

  it("should allow deployer to transfer tokens", async () => {
    let instance = await MintableToken.deployed();

    const senderPreBalance = await instance.balanceOf(accounts[0]);
    const receiverPreBalance = await instance.balanceOf(accounts[1]);

    await instance.transfer(accounts[1], PLACEHOLDER_TKNBITS);

    const senderPostBalanace = await instance.balanceOf(accounts[0]);
    const receiverPostBalance = await instance.balanceOf(accounts[1]);

    assert(
      senderPreBalance - senderPostBalanace < PLACEHOLDER_TKNBITS + ACCURACY
    );
    assert(
      receiverPostBalance - receiverPreBalance < PLACEHOLDER_TKNBITS + ACCURACY
    );
  });

  it("should disallow deployer to transfer tokens to zero address", async () => {
    let instance = await MintableToken.deployed();
    try {
      await instance.transfer(ZERO_ADDRESS, PLACEHOLDER_TKNBITS);
    } catch (err) {
      assert.equal(err.reason, "ERC20: transfer to the zero address");
    }
  });

  it("should disallow deployer to transfer more than the balance", async () => {
    let instance = await MintableToken.deployed();
    const balance = await instance.balanceOf(accounts[0]);

    try {
      await instance.transfer(accounts[1], balance + PLACEHOLDER_TKNBITS);
    } catch (err) {
      assert.equal(err.reason, "ERC20: transfer amount exceeds balance");
    }
  });
});
