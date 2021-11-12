// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.10;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";

contract DobriyalTokenCrowdsale is Crowdsale {
    constructor(uint256 rate, address payable wallet, IERC20 token) 
        Crowdsale(rate, wallet, token)
        public
    {
        
    }
}