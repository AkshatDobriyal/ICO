const { duration } = require("../test/helpers/increaseTime");

const DobriyalToken = artifacts.require("DobriyalToken");
const DobriyalTokenCrowdsale = artifacts.require("DobriyalTokenCrowdsale");
const PriceConsumerV3 = artifacts.require("PriceConsumerV3");

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

    await deployer.deploy(PriceConsumerV3);
    const PriceConsumerV3 = await PriceConsumerV3.deployed();
    // ETH/USD
    uint256 price = PriceConsumerV3.getLatestPrice();

    await deployer.deploy(DobriyalToken, _name, _symbol, _decimals);
    const deployedToken = await DobriyalToken.deployed();

    const latestTime = (new Date).getTime();

    const _rate = price/0.001; // token price = $0.001 = 2.1e-7 ETH => rate = 1 / 2.1e-7 = 4761904.76 (current rate)
                               // token price = $0.001 = 0.001/price ETH => rate = price/0.001 (price = ETH/USD) (generalized rate)
    const _wallet = accounts[0];
    const _token = deployedToken.address;
    const _cap = ether(12500000/price); // cap = USD 12.5 million = 2669.14 ETH (current cap)
                                // cap = USD 12.5 million = 12500000/price ETH (generalized cap)
    const _openingTime = latestTime + duration.days(1); 
    const _closingTime = _openingTime + duration.weeks(4); // duration = 30 days = 4 weeks
    const _goal = ether(5000000/price); // soft cap = $5,000,000 = 1067.98 ETH (current cap)
                                // soft cap = $5,000,000 = 5,000,000/price ETH (generalized soft cap)
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
