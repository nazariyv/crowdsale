// This script uses @nomiclabs/buidler-truffle5
// eslint-disable-next-line
const env = require("@nomiclabs/buidler");
const bignumber = require("bignumber.js");

async function main() {
  await env.run("compile");

  const initialSupply = new bignumber(1000 * 10 ** 18).toFixed();
  const Token = env.artifacts.require("Token");
  const token = await Token.new(initialSupply.toString());

  console.log("Deployed ERC20 token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
