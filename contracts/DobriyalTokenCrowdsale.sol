// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/WhitelistCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/TokenTimelock.sol";
contract DobriyalTokenCrowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale, IndividuallyCappedCrowdsale, TimedCrowdsale, WhitelistCrowdsale, RefundableCrowdsale {

    uint256 _rate;
    address payable _wallet;
    // minimum investor contribution = 0.11 Ether
    uint256 public investorMinCap = 110000000000000000;
    mapping(address => uint256) public contributions;

    // crowdsale stages
    enum CrowdsaleStage { PreICO, ICO }
    // Default to presale stage
    CrowdsaleStage public stage = CrowdsaleStage.PreICO;

    // token distribution
    uint256 reserveWalletPercentage = 30;
    uint256 interestPayoutWalletPercentage = 20;
    uint256 teamMembersHRWalletPercentage = 10;
    uint256 companyGeneralFundWalletPercentage = 13;
    uint256 airdropsWalletPercentage = 2;
    uint256 tokenSaleWalletPercentage = 25;

    address interestPayoutWallet;
    address teamMembersHRWallet;
    address companyGeneralFundWallet;
    address airdropsWallet;
    address tokenSaleWallet;

    constructor(
        uint256 _rate,
        address payable _wallet,
        IERC20 _token,
        uint256 _cap, //2712.37 Ether
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _goal,
        address _interestPayoutWallet,
        address _teamMembersHRWallet,
        address _companyGeneralFundWallet,
        address _airdropsWallet,
        address _tokenSaleWallet

    )
        Crowdsale(_rate, _wallet, _token)
        CappedCrowdsale(_cap)
        TimedCrowdsale(_openingTime, _closingTime)
        public
    {
        require(_goal <= _cap);
        interestPayoutWallet = _interestPayoutWallet;
        teamMembersHRWallet = _teamMembersHRWallet;
        companyGeneralFundWallet = _companyGeneralFundWallet;
        airdropsWallet = _airdropsWallet;
        tokenSaleWallet = _tokenSaleWallet;
    }

    // forwards funds to the wallet during the PreICO stage, then the refund vault during ICO stage
    function setCrowdsaleStage(uint _stage) public {
        if(uint(CrowdsaleStage.PreICO) == _stage){
            stage = CrowdsaleStage.PreICO;
        } else if(uint(CrowdsaleStage.ICO) == _stage){
            stage = CrowdsaleStage.ICO;
        }

        if(stage == CrowdsaleStage.PreICO) {
            _rate = 500;
        } else if(stage == CrowdsaleStage.ICO) {
            _rate = 250;
        }
    }

    function _forwardFunds() internal {
        if(stage == CrowdsaleStage.PreICO){
            _wallet.transfer(msg.value);
        } else if(stage == CrowdsaleStage.ICO) {
            super._forwardFunds();
        }
    }

    function finalization() internal {
        if(goalReached()){
            // Finish minting the token
            ERC20Mintable _mintableToken = ERC20Mintable(token);
            uint256 _alreadyMinted = _mintableToken.totalSupply();

            uint256 _finalTotalSupply = _alreadyMinted.div(reserveWalletPercentage).mul(100);
            
            _mintableToken.mint(interestPayoutWallet, _finalTotalSupply.div(interestPayoutWalletPercentage));
            _mintableToken.mint(teamMembersHRWallet, _finalTotalSupply.div(teamMembersHRWalletPercentage));
            _mintableToken.mint(companyGeneralFundWallet, _finalTotalSupply.div(companyGeneralFundWalletPercentage));
            _mintableToken.mint(airdropsWallet, _finalTotalSupply.div(airdropsWallet));
            _mintableToken.mint(tokenSaleWallet, _finalTotalSupply.div(tokenSaleWallet));

            _mintableToken.finishMinting();
            // unpause the token
            ERC20Pausable _pausableToken = ERC20Pausable(token);
            _pausableToken.unpause();
            _pausableToken.transferOwnership(wallet);
        }
        super.finalization();
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