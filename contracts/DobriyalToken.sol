// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/MintableToken.sol";
import "@openzeppelin/contracts/token/ERC20/PausableToken.sol";
import "@openzeppelin/contracts/token/ERC20/DetailedERC20.sol";

contract DobriyalToken is ERC20, MintableToken, PausableToken, DetailedERC20 {
    constructor(string memory _name, string memory _symbol, uint8 _decimals) 
        DetailedERC20(_name, _symbol, _decimals)
        public
    {
        
    }
}