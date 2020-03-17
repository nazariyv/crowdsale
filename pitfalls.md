# Links

- https://medium.com/rayonprotocol/ico-procedure-ethereum-erc20-through-openzeppelin-1840b6577029
  Talks about using Truffle (development environment for smart contracts) with OpenZeppelin's TimedCrowdsale, as well
  as MintedCrowdsale to perform an ICO on Ropsten test network. We should go with the token that we personally are owner of, this reduces the number of points of failures. In this case, the crowdsale contract is bare-bones and is responsible for sending the tokens that we sent it only. It is not responsible for minting any new tokens.

- https://blog.openzeppelin.com/how-to-create-token-and-initial-coin-offering-contracts-using-truffle-openzeppelin/
  Here is a quote from this link:

1. > Zeppelin Solidity is a library that has extensive and well tested smart contracts that adhere to security best practices. In the smart contract world where a small bug can cost you money, it is good not to reinvent the wheel when there are trusted solutions out there.

- https://openzeppelin.com/security-audits/
  OpenZeppelin, themselves provide companies with security audits of the smart contracts. This implies that if their code is flawed, they should not be in business. They have audited companies like Libra, Compound, Uniswap, Maker, and many more. All very big names in the Dapp space.
  Here is an example of one of the re-entrancy hacks OpenZeppelin discovered: https://blog.openzeppelin.com/exploiting-uniswap-from-reentrancy-to-actual-profit/. This should give us a lot of condifence in the safeness of their contracts, also given the fact that we have not added a single line of our code!

# Notes

1. Google search `OpenZeppelin ICO hack` does not return anything related to security flaws. However,
   `OpenZeppelin contract flaw` did return something interesting: https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca. This article talks about the flaw revealed by the new
   OPCODE introduced in the Byzantium hardfork, namely `RETURNDATASIZE`. This opcode stores the size of the returned data from an external call, if the returned data has different size, the transaction reverts. Due to how `OpenZeppelin` implemented the `ERC20Basic` token between 17 March 2017 and 13 July 2017: https://github.com/OpenZeppelin/openzeppelin-solidity/blob/52120a8c428de5e34f157b7eaed16d38f3029e66/contracts/token/ERC20Basic.sol, a lot of issued tokens had this flaw. This flaw materializes in the following way: if you expect a token that implements an `ERC20` interface in your `solc >= 0.4.22` compiled contract, it won't be able to interact with the contracts that used `OpenZeppelin`'s implementation (because they are not truly implementing an ERC20 interface). Looking at current interface of the `ERC20` token in `OpenZeppelin`: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol, I can see that this issue is fixed and the `transfer` method does have a correct return signature of a `boolean`.
2. Found an overflow attack on BEC tokens: https://medium.com/@peckshield/alert-new-batchoverflow-bug-in-multiple-erc20-smart-contracts-cve-2018-10299-511067db6536. This did not use `OpenZeppelin` but highlights the importance of using `SafeMath.sol` developed by `OpenZeppelin`: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol for any on-chain mathematical operations.

No more issues were found using combinations of `hack`, `flaw` and `openzeppelin` queries.

Future reading, assembly in Solidity:

1. https://medium.com/@jeancvllr/solidity-tutorial-all-about-assembly-5acdfefde05c - assembly in Solidity
2. https://medium.com/@blockchain101/solidity-bytecode-and-opcode-basics-672e9b1a88c2 - solidity opcodes
3. https://solidity.readthedocs.io/en/v0.6.2/assembly.html

# OpenZeppellin GitHub issues

# OpenZeppellin contract inspection

# TODOs

- Make the token mintable
- Mnemonic of the contract that owns the token and crowdsale into a secret file
- Add a bunch of tests
- If time permits, add the front for this project
