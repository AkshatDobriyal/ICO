// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.10;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/WhitelistCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/RefundableCrowdsale.sol";

contract DobriyalTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale, IndividuallyCappedCrowdsale, TimedCrowdsale, WhitelistCrowdsale, RefundableCrowdsale {

    // minimum investor contribution = 0.11 Ether
    uint256 public investorMinCap = 110000000000000000;
    mapping(address => uint256) public contributions;

    

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token,
        uint256 _cap, //2712.37 Ether
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _goal
    )
        Crowdsale(rate, wallet, token)
        CappedCrowdsale(_cap)
        TimedCrowdsale(_openingTime, _closingTime)
        public
    {
        require(_goal <= _cap);
    }

    /*function getUserContribution(address _beneficiary) public view returns (uint256){
        return contributions[_beneficiary];
    }

    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {

        super._preValidatePurchase(_beneficiary, _weiAmount);
        uint256 _existingContribution = contributions[_beneficiary];
        uint256 _newContribution = _existingContribution.add(_weiAmount);
        require(_newContribution >= investorMinCap);
        contributions[_beneficiary] = _newContribution;
    }*/
}