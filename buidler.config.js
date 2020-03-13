usePlugin("@nomiclabs/buidler-truffle5");
usePlugin("@nomiclabs/buidler-web3");

const bignumber = require("bignumber.js");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await web3.eth.getAccounts();

  for (const account of accounts) {
    console.log(account);
  }
});

task(
  "send-token-to-crowdsale",
  "Sends some ERC20 tokens to Crowdsale contract",
  async () => {
    const erc20Abi = require("./artifacts/ERC20.json").abi;

    const Crowdsale = "0xd3abdf80945900d270176d0cd5c14fae0087e20c";
    const ERC20Token = "0xdeea29c7ca89f13b538347a44ca147e39a70fe61";
    const erc20 = new web3.eth.Contract(erc20Abi, ERC20Token);
    const accounts = await web3.eth.getAccounts();

    const tx = await erc20.methods
      .transfer(Crowdsale, bignumber(100 * 10 ** 18).toFixed())
      .send({ from: accounts[0] });

    console.log("tx", tx);
  }
);

module.exports = {
  defaultNetwork: "mainnet",
  networks: {
    mainnet: {
      url: "",
      accounts: {
        mnemonic: "eat my pants"
      }
    }
  }
};
