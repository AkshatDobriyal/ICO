import ether from "./helpers/ether";

const { assert } = require("chai");
const BigNumber = web3.BigNumber;

require("chai")
    .use(require("chai-bignumber")(BigNumber))
    .should();

const DobriyalToken = artifacts.require("DobriyalToken");
const DobriyalTokenCrowdsale = artifacts.require("DobriyalTokenCrowdsale");

contract("DobriyalTokenCrowdsale", function([_, wallet, investor1, investor2]) {

    beforeEach(async function () {
        // token config
        this.name = "DobriyalToken";
        this.symbol = "DOBRIYAL";
        this.decimals = 18;

        // deploy token
        this.token = await DobriyalToken.new(
            this.name,
            this.symbol,
            this.decimals
        );

        // Crowdsale config
        this.rate = 500;
        this.wallet = wallet;

        // deploy crowdsale
        this.crowdsale = await DobriyalTokenCrowdsale.new(
            this.rate,
            this.wallet,
            this.token.address
        );

        // transfer token ownerable to crowdsale
        await this.token.transferOwnership(this.crowdsale.address);
    })

    describe("crowdsale", function () {
        it("track the rate", async function () {
            const rate = await this.crowdsale.rate();
            rate.should.be.bignumber.equal(this.rate);
        })

        it("track the wallet", async function () {
            const wallet = await this.crowdsale.wallet();
            wallet.should.equal(this.wallet);
        })

        it("track the token", async function () {
            const token = await this.crowdsale.token();
            token.should.equal(this.token.address);
        })
    })

    describe("minted crowdsale", function() {
        it("mints tokens after purchase", async function() {
            const originalTotalSupply = await this.token.totalSupply();
            await this.crowdsale.sendTransaction({ value: ether(1), from: investor1});
            const newTotalSupply = await this.token.totalSupply();
            assert.isTrue(newTotalSupply > originalTotalSupply);
        })
    })

    describe("accepting payments", function() {
        it("should accept payments", async function() {
            const value = ether(1);
            const purchaser = investor2;
            await this.crowdsale.sendTransactions({ value: value, from: investor1 }).should.be.fulfilled;
            await this.crowdsale.buyTokens(investor1, { value: value, from: purchaser }).should.be.fulfilled;
        })
    })
})