# Crowdsale

Ethereum ERC20 crowdsale

# High level

Investor sends ether to an address and immediately gets back tokens

# Technicals

## Crowdsale rate

This is the "exchange rate" of Ethereum to Token. The smallest/atomic unit of Ethereum is wei.
See below to find out how many weis and TKNbits there are in 1 ETH and 1 ERC20 token respectively

`1 ETH === 10^18 wei`

`1 TKN === 10^(decimals) TKNbits`

off-topic: in ERC777, `decimals` is set to be 18

We shall use `decimals=18` in our ERC20 (we can make this ERC777, which is backwards compatible, easily) crowdsale too

Every self-respecting crowdsale needs a `crowdsale rate`. This will define how many tokens you get per units of ethereum you send.

Let's define our `crowdsale rate` to be: 0.0001 ETH = 1 TKN (this is equivalent to `100000000000000` wei per 10^18 TKNbits; 10^14 wei === 10^18 TKNbits => 1 wei = 10000 TKNbits). In other words the rate is `10000`.

## Token Emission

We shall use standard OpenZeppelin's `Crowdsale` contract. How it works: the contract will own the tokens and transfer them to users that purchase them. We are not using `MintedCrowdsale` because there is an extra complexity that this contract must have a permission from `ERC20Mintable` contract to mint the tokens. Instead, we shall mint as many tokens as we want, and send them to the `Crowdsale` contract that will distribute these to purchasers.

Other options:

- `MintedCrowdsale` - we mint the tokens as they are purchased.
- `AllowanceCrowdsale` - not gonna need this.

## Validation

None will be used. Available options are:

- `CappedCrowdsale` - adds a cap to your crowdsale, invalidating any purchases that would exceed that cap
- `IndividuallyCappedCrowdsale` - caps an individual’s contributions
- `WhitelistCrowdsale` - only allow whitelisted participants to purchase tokens
- `TimedCrowdsale` - adds an `openingTime` and `closingTime` to the crowdsale

## Distribution

We release them as participants purchase them. This can be changed, see the section above.

## For devs

Go into root, then

`$yarn install`

to install dependencies, next, you are ready to deploy the contracts. Run

`$yarn buidler run scripts/deploy-token.js`

now that you have deployed the token, you are ready to deploy the Crowdsale smart contract

`$yarn buidler run scripts/deploy-crowdsale.js`

now send some newly minted tokens to the crowdsale contract

`$yarn buidler send-token-to-crowdsale`

congrats! use the crowdsale smart contract address to send it some wei to get back tokens

### TODOs

- Make the token mintable
- Mnemonic of the contract that owns the token and crowdsale into a secret file
- Add a bunch of tests
- If time permits, add the front for this project
- Add live network deployment with truffle
- Change the readme.md (removed the buidler)
