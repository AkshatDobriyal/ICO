// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.10;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract DobriyalTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale {

    // minimum investor contribution = 0.11 Ether
    uint256 public investorMinCap = 110000000000000000;
    mapping(address => uint256) public contributions;

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token,
        uint256 _cap //2712.37 Ether
    )
        Crowdsale(rate, wallet, token)
        CappedCrowdsale(_cap)
        public
    {
        
    }

    /**
    * @dev Extend parent behaviour requiring purchase to respect investor min/max funding cap.
    * @param _beneficiary Token purchaser
    * @param _weiAmount Amount of wei contributed
    */

    function getUserContribution(address _beneficiary) public vie returns (uint256){
        return contributions[_beneficiary];
    }

    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal{

        super._preValidatePurchase(_beneficiary, _weiAmount);
        uint256 _existingContribution = contributions[_beneficiary];
        uint256 _newContribution = _existingContribution.add(_weiAmount);
        require(_newContribution >= investorMinCap);
        contributions[_beneficiary] = _newContribution;
    }
}