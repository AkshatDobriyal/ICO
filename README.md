# Dobriyal Crowdsale

This project demonstrates a crowdsale with specific characteristics and some extensive features, developed using the **OpenZeppelin** library. It has a smart contract based on the ERC20 standard token, i.e. DobriyalToken and another smart contract, DobriyalTokenCrowdsale, to manage the working of the crowdsale. Tests have been written vigorously for each and every functionality of the crowdsale and token.

**Tech-Stack:** Solidity, Truffle, Ganache, OpenZeppelin, Chainlink Price Feeds Oracle

**Chainlink Price Feeds Oracle:** 

Chainlink Price Feeds Oracle has been used to fetch price data into the Solidity smart contract.

Chainlink Price Feeds use multiple high-quality data inputs and aggregate them through a decentralized network of Chainlink oracles that feed price data into reference contracts, where the results are again aggregated in an Aggregator Smart Contract as the latest, trusted answer.

The smart contract PriceConsumerV3.sol has the function getLatestPrice() that returns the **price**, the current ETH/USD, i.e. the amount of USD equal to 1 ETH. This price has been used in the crowdsale smart contract to calculate the rate, soft cap and hard cap at any point of time.

## Crowdsale Characteristics (Calculations based on the given details)

Total number of tokens : 50,000,000,000

**Distribution of Tokens :**	 			

- Reserve Wallet: 30% (20 billion)
- Interest Payout Wallet: 20% (10 billion)
- Team Members HR Wallet: 10% (5 billion) 
- Company General Fund Wallet: 13% (6.5 billion) 
- Bounties/Airdrops Wallet: 2% (1 billion)
- Token Sale Wallet: 25% (12.5 billion) 

**Token Price** : $0.001

**(Generalized Rate)**
=> Token Price = 0.001/price ETH
=> **Rate** = price/0.001

**(Current Rate)**
=> Token Price = 2.1e-7 ETH
=> Rate = 1 / 2.1e-7
=> **Rate** = 4761904.76

**Private sale Duration** :  15 days

**PreSale Duration** : 15 Days

**CrowdSale Duration** : 30 Days

**SoftCap** : $5,000,000

**(Generalized soft cap)**
=> **Goal** = $5,000,000 = 5,000,000/price ETH

**(Current soft cap)**
=> **Goal** = $5,000,000 = 1067.98 ETH

**HardCap** : 

**(Generalized hard cap)**
**HardCap** =  USD 12.5 million = 12500000/price ETH

**(Current hard cap)**
**HardCap** = USD 12.5 million = 2669.14 ETH

              

**Minimum cap for each investor** : 

**(Generalized soft cap for each investor)**
**Minimum cap for each investor** = $500 = 500/price ETH

**(Current soft cap for each investor)**
**Minimum cap for each investor** = $500 = 0.11 ETH

**Bonus** : 

Private Sale : 25%

Pre-Sale : 20%

CrowdSale : 15% 1st week, 10% 2nd week, 5% 3rd week, 0% 4th week

## The DobriyalCrowdsale follows all the standards of the OpenZeppelin crowdsale smart contract and has the characteristics and functionalities of:

- **MintedCrowdsale** (helps to mint tokens during crowdsale)
- **CappedCrowdsale** (helps to put a hard cap or maximum limit on the crowdsale) 
- **IndividuallyCappedCrowdsale** (helps to put a hard cap or soft cap on each individual investor)
- **TimedCrowdsale** (helps to decide the opening and closing time of the crowdsale)
- **WhitelistedCrowdsale** (helps to whitelist authorized investors to participate in the crowdsale)
- **RefundableCrowdsale** (helps to claim refund if the crowdsale goal is not reached)

## The Dobriyaltoken smart contract follows ERC20 standards and has the features of:

- **MintableToken** (tokens that are created without performing any underlying consensus related activity)
- **PausableToken** (a token that can be paused to prevent any transfers of the token when it is paused)
- **DetailedERC20** (a scripting standard used within the Ethereum blockchain)

## Tests

Extensive tests have been written for each and every functionality of the crowdsale and token.

**1. DobriyalToken_test.js**

  Contains tests for:
  
  - checking if the token is deployed correctly
  - checking if the token has the correct attributes
  
**2. DobriyalTokenCrowdsale_test.js:**

  Contains tests for:
  
  - checking if the crowdsale id deployed correctly
  - checking if the investors can buy tokens
  - checking the minting of the tokens
  - checking the hard cap on the crowdsale
  - checking the soft cap on each individual investor
  - checking if the crowdsale has a specific opening and closing time
  - checking if only the whitelisted investors can participate in the crowdsale
  - checking if refund can be claimed if the crowdsale goal is not reached
  

The smart contracts follow Solidity best practices and the OpenZeppelin standards which enables to build a gas optimized code.
The complete code including tests, migration files, etc has a proper structure and follows coding standards.
