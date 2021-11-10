const DobriyalToken = artifacts.require("DobriyalToken");

module.exports = function (deployer) {
    const _name = "Dobriyal Token";
    const _symbol = "DOBRIYAL"
    //const _decimals = 18;

    deployer.deploy(DobriyalToken, _name, _symbol);
};
