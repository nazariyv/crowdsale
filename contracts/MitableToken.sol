pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract MintableToken is ERC20Mintable, ERC20Detailed {
    constructor(uint256 initialSupply)
        public
        ERC20Detailed("Mintable", "MNT", 18)
    {
        _mint(msg.sender, initialSupply);
    }
}
