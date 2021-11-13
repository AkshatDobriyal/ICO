const { duration } = require("../test/helpers/increaseTime");

const DobriyalToken = artifacts.require("DobriyalToken");
const DobriyalTokenCrowdsale = artifacts.require("DobriyalTokenCrowdsale");

const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};

module.exports = function (deployer, network, accounts) {
    const _name = "Dobriyal Token";
    const _symbol = "DOBRIYAL";
    const _decimals = 18;

    await deployer.deploy(DobriyalToken, _name, _symbol, _decimals);
    const deployedToken = await DobriyalToken.deployed();

    const latestTime = (new Date).getTime();

    const _rate = 4761904.76; // token price = $0.001 = 2.1e-7 ETH => rate = 1 / 2.1e-7 = 4761904.76
    const _wallet = accounts[0];
    const _token = deployedToken.address;
    const _cap = ether(1067.98); // soft cap = $5,000,000 = 1067.98 ETH
    const _openingTime = latestTime + duration.days(1); 
    const _closingTime = _openingTime + duration.days(30); // duration = 30 days
    const _goal = ether(2669.14); // goal = USD 12.5 million = 2669.14 ETH
    const _reserveWallet = accounts[0];
    const _interestPayoutWallet = accounts[0];
    const _teamMembersHRWallet = accounts[0];
    const _companyGeneralFundWallet = accounts[0];
    const _airdropsWallet = accounts[0];
    const _tokenSaleWallet = accounts[0];

    await deployer.deploy(DobriyalTokenCrowdsale,
        _rate,
        _wallet,
        _token,
        _cap,
        _openingTime,
        _closingTime,
        _goal,
        _reserveWallet,
        _interestPayoutWallet,
        _teamMembersHRWallet,
        _companyGeneralFundWallet,
        _airdropsWallet,
        _tokenSaleWallet,
    )
    return true;
};
