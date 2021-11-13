const DobriyalToken = artifacts.require("DobriyalToken");
const DobriyalTokenCrowdsale = artifacts.require("DobriyalTokenCrowdsale");

module.exports = function (deployer) {
    const _name = "Dobriyal Token";
    const _symbol = "DOBRIYAL";
    const _decimals = 18;

    deployer.deploy(DobriyalToken, _name, _symbol, _decimals).then(function() {
        return deployer.deploy(DobriyalTokenCrowdsale, 500, DobriyalToken.address, DobriyalToken.address, 100)
    });
};
