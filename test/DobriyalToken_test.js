const { assert } = require("chai");

require("chai")
    .should();
const DobriyalToken = artifacts.require("DobriyalToken");

contract("DobriyalToken", accounts => {

    const _name = "Dobriyal Token";
    const _symbol = "DOBRIYAL";

    beforeEach(async function () {
        this.token = await DobriyalToken.new(_name, _symbol);
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
    })
})