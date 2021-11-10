// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
//import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

contract DobriyalToken is ERC20 {
    constructor(string memory _name, string memory _symbol) 
        ERC20(_name, _symbol)
        public
    {
        
    }
}