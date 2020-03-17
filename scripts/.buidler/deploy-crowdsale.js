// This script uses @nomiclabs/buidler-truffle5
// eslint-disable-next-line
const env = require("@nomiclabs/buidler");

async function main() {
  await env.run("compile");

  const rate = "10000";
  const receiverWallet = "0x465DCa9995D6c2a81A9Be80fBCeD5a770dEE3daE";
  const ERC20Token = "0xdeea29c7ca89f13b538347a44ca147e39a70fe61";

  const Crowdsale = env.artifacts.require("Crowdsale");
  const crowdsale = await Crowdsale.new(rate, receiverWallet, ERC20Token);

  console.log("Deployed Crowdsale smart contract address:", crowdsale.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
