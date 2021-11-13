const { assert } = require("chai");
const BigNumber = web3.BigNumber;

require("chai")
    .use(require("chai-bignumber")(BigNumber))
    .should();

const DobriyalToken = artifacts.require("DobriyalToken");

contract("DobriyalToken", accounts => {

    const _name = "Dobriyal Token";
    const _symbol = "DOBRIYAL";
    const _decimals = 18;

    beforeEach(async function () {
        this.token = await DobriyalToken.new(_name, _symbol, _decimals);
    })

    describe("token attributes", function(){
        it("has the correct name", async function(){
            const name = await this.token.name();
            name.should.equal(_name);
            //assert.equal(name, _name);
        })

        it("has the correct symbol", async function () {
            const symbol = await this.token.symbol();
            symbol.should.equal(_symbol);
            //assert.equal(symbol, _symbol);
        })

        /*it("has the correct decimals", async function () {
            const decimals = await this.token.decimals();
            decimals.should.be.bignumber.equal(_decimals);
        })*/
    })
})