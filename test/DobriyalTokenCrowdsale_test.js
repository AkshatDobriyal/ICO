//const{ ether } = require("./helpers/ether");
import EVMRevert from "./helpers/EVMRevert";
import { increaseTimeTo, duration } from "./helpers/increaseTime";
import latestTime from "./helpers/latestTime";
//import "@openzeppelin/contracts/ownership/Ownable.sol";
const { assert } = require("chai");
const BigNumber = web3.BigNumber;
const { Web3 } = require('web3');

require("chai")
    .use(require("chai-bignumber")(BigNumber))
    .should();

const DobriyalToken = artifacts.require("DobriyalToken");
const DobriyalTokenCrowdsale = artifacts.require("DobriyalTokenCrowdsale");
const RefundVault = artifacts.require("./RefundVault");

contract("DobriyalTokenCrowdsale", function ([_, wallet, investor1, investor2]) {

    before(async function () {
        // transfer extra ether to investor1's account for testing
        await web3.eth.sendTransaction({ from: _, to: investor1, value: ether(25) })
    })

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
        this.cap = ether(100);
        this.openingTime = latestTime() + duration.weeks(1);
        this.closingTime = this.openingTime + duration.weeks(1);
        this.goal = ether(50);

        // investor cap
        this.investorMinCap = 110000000000000000;

        // ICO stages
        this.preIcoStage = 0;
        this.preIcoRate = 500;
        this.icoStage = 1;
        this.icoRate = 250;

        // token distribution
        this.reserveWalletPercentage = 30;
        this.interestPayoutWalletPercentage = 20;
        this.teamMembersHRWalletPercentage = 10;
        this.companyGeneralFundWalletPercentage = 13;
        this.airdropsWalletPercentage = 2;
        this.tokenSaleWalletPercentage = 25;

        // deploy crowdsale
        this.crowdsale = await DobriyalTokenCrowdsale.new(
            this.rate,
            this.wallet,
            this.token.address,
            this.cap,
            this.openingTime,
            this.closingTime,
            this.goal,
            this.reserveWallet,
            this.interestPayoutWallet,
            this.teamMembersHRWallet,
            this.companyGeneralFundWallet,
            this.airdropsWallet,
            this.tokenSaleWallet,
            this.releaseTime
        );

        await this.token.pause();

        // transfer token ownerable to crowdsale
        await this.token.transferOwnership(this.crowdsale.address);

        // add investors to whitelist
        await this.token.crowdsale.addManyToWhiteList([investor1, investor2]);

        // advance time to crowdsale start
        await increaseTimeTo(this.openingTime + 1);
    })

    // test crowdsale deployment

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

    // test token token minting
    describe("minted crowdsale", function () {
        it("mints tokens after purchase", async function () {
            const originalTotalSupply = await this.token.totalSupply();
            await this.crowdsale.sendTransaction({ value: ether(1), from: investor1 });
            const newTotalSupply = await this.token.totalSupply();
            assert.isTrue(newTotalSupply > originalTotalSupply);
        })
    })

    // test the crowdsale hard cap
    describe("capped crowdsale", function () {
        it("has the correct hard cap", async function () {
            const cap = await this.crowdsale.cap();
            cap.should.be.bignumber.equal(this.cap);
        })
    })

    // test the timed crowdsale
    describe("timed crowdsale", function () {
        it("is open", async function () {
            const isClosed = await this.crowdale.hasClosed();
            isClosed.should.be.false;
        })
    })

    // test if only whitelisted investors can buy token
    describe("whitelisted crowdsale", function () {
        it("rejects contributions from non-whitelisted investors", async function () {
            const notWhitelisted = _;
            await this.crowdsale.buyToken(notWhitelisted, { value: ether(1), from: notWhitelisted }).should.be.rejectedWith(EVMRevert);
        })
    })

    // test if investors can claim refund
    describe("refundable crowdsale", function () {
        beforeEach(async function () {
            await this.crowdsale.buyTokens(investor1, { value: ether(1), from: investor1 })
        })

        describe("during crowdsale", function () {
            it("prevents the investor from claiming refund", async function () {
                await this.vault.refund(invetor1, { from: investor1 }).should.be.rejectedWith(EVMRevert);
            })
        })
    })

    // tests for the rates at preIco and ICO stages
    describe("crowdsale stages", function () {
        it("it starts in preICO", async function () {
            const stage = await this.crowdsale.stage();
            stage.should.be.bignumber.equal(this.preIcoStage);
        })

        it("starts at the opening (deployed) rate", async function () {
            const rate = await this.crowdsale.rate();
            rate.should.be.bignumber.equal(this.rate);
        })

        // test to chcek whether only admin can update stage and rate
        it("allows admin to update the stage & rate", async function () {
            await this.crowdsale.setCrowdsaleStage(this.icoStage, { from: _ });
            const stage = await this.crowdsale.stage();
            stage.should.be.bignumber.equal(this.icoStage);
            const rate = await this.crowdsale.rate();
            rate.should.be.bignumber.equal(this.icoRate);
        })

        it("prevents non-admin from updating the stage", async function () {
            await this.crowdsale.setCrowdsaleStage(this.icoStage, { from: investor1 }).should.be.rejectedWith(EVMRevert);
        })
    })

    // test the payment accepting functionality
    describe("accepting payments", function () {
        it("should accept payments", async function () {
            const value = ether(1);
            const purchaser = investor2;
            await this.crowdsale.sendTransactions({ value: value, from: investor1 }).should.be.fulfilled;
            await this.crowdsale.buyTokens(investor1, { value: value, from: purchaser }).should.be.fulfilled;
        })
    })

    // test the buyToken functionality for soft cap
    describe("buyTokens()", function () {
        describe("when the contribution is less than the minimum cap", function () {
            it("rejects the transaction", async function () {
                const value = this.investorMinCap - 1;
                await this.crowdsale.buyTokens(investor2, { value: value, from: investor2 }).should.be.rejectedWith(EVMRevert);
            })
        })
    })

    describe("buyTokens()", function () {
        it("allows the investor to contribute below the minimum cap", async function () {
            // first contribution is valid
            const value1 = ether(1);
            await this.crowdsale.buyTokens(investor1, { value: value1, from: investor1 });
            // second contribution is less than investor cap
            const value2 = 1; //wei
            await this.crowdsale.buyTokens(investor1, { value: value1, from: investor1 }).should.be.fulfilled;
        })
    })

    // test to chcek the finalizing the crowdsale
    describe("finalizing the crowdsale", function () {
        describe("when the goal is not reached", function () {
            beforeEach(async function () {
                // do not meet the goal
                await this.crowdsale.buyTokens(investor2, { value: ether(1), from: investor2 });
                // fastforwarding past end time
                await increaseTimeTo(this.closingTime + 1);
                // finalize the crowdsale
                await this.crowdsale.finalize({ from: _ });
            })
            it("allows the investor to claim refund", async function () {
                await this.vault.refund(investor2, { from: investor2 }).should.be.fulfiled;
            })
        })

        describe("when the goal is reached", function () {
            beforeEach(async function () {
                // track current wallet balance
                this.walletBalance = await web3.eth.getBalance(wallet);

                // meet the goal
                await this.crowdsale.buyTokens(investor1, { value: ether(26), from: investor1 });
                await this.crowdsale.buyTokens(investor2, { value: ether(26), from: investor2 });
                // fastforward past end time
                await increaseTimeTo(this.closingTime + 1);
                // finalize the crowdsale
                await this.crowdsale.finalize({ from: _ });
            })

            it("handles goal reached", async function () {
                // tracks goal reached
                const goalReached = await this.crowdsale.goalReached();
                goalReached.should.be.true;

                // finishes minting token
                const mintingFinished = await this.token.mintingFinished();
                mintingFinished.should.be.true;

                // unpauses the token
                const paused = await this.token.paused();
                paused.should.be.false;

                const owner = await this.token.owner();
                paused.should.equal(this.wallet);

                // pevents investor from claiming refund
                await this.vault.refund(investor1, { from: investor1 }).should.be.rejectedWith(EVMRevert);
            })
        })

        // tests to check if the token distribution is correct
        describe("token distribution", function () {
            it("tracks token distribution correctly", async function () {
                const reserveWalletPercentage = await this.crowdsale.reserveWalletPercentage();
                reserveWalletPercentage.should.be.bignumber.eq(this.reserveWalletPercentage, "has correct reserveWalletPercentage");

                const interestPayoutWalletPercentage = await this.crowdsale.interestPayoutWalletPercentage();
                interestPayoutWalletPercentage.should.be.bignumber.eq(this.interestPayoutWalletPercentage, "has correct interestPayoutWalletPercentage");

                const teamMembersHRWalletPercentage = await this.crowdsale.teamMembersHRWalletPercentage();
                teamMembersHRWalletPercentage.should.be.bignumber.eq(this.teamMembersHRWalletPercentage, "has correct teamMembersHRPercentage");

                const companyGeneralFundWalletPercentage = await this.crowdsale.companyGeneralFundWalletPercentage();
                companyGeneralFundWalletPercentage.should.be.bignumber.eq(this.companyGeneralFundWalletPercentage, "has correct companyGeneralFundWalletPercentage");

                const airdropsWalletPercentage = await this.crowdsale.airdropsWalletPercentage();
                airdropsWalletPercentage.should.be.bignumber.eq(this.airdropsWalletPercentage, "has correct airdropsWalletPercentage");

                const tokenSaleWalletPercentage = await this.crowdsale.tokenSaleWalletPercentage();
                tokenSaleWalletPercentage.should.be.bignumber.eq(this.tokenSaleWalletPercentage, "has correct tokenSaleWalletPercentage");
            })

            // test to chcek if all distributions sum up to 100
            it("is a valid percentage breakdown", async function () {
                const reserveWalletPercentage = await this.crowdsale.reserveWalletPercentage();

                const interestPayoutWalletPercentage = await this.crowdsale.interestPayoutWalletPercentage();

                const teamMembersHRWalletPercentage = await this.crowdsale.teamMembersHRWalletPercentage();

                const companyGeneralFundWalletPercentage = await this.crowdsale.companyGeneralFundWalletPercentage();

                const airdropsWalletPercentage = await this.crowdsale.airdropsWalletPercentage();

                const tokenSaleWalletPercentage = await this.crowdsale.tokenSaleWalletPercentage();

                const total = reserveWalletPercentage.toNumber() + interestPayoutWalletPercentage.toNumber() + teamMembersHRWalletPercentage.toNumber() + companyGeneralFundWalletPercentage.toNumber() + airdropsWalletPercentage.toNumber() + tokenSaleWalletPercentage.toNumber();
                total.should.equal(100);
            })
        })

    })

})