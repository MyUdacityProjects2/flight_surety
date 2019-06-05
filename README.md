# Flight Surety project - overview


## Quickstart
`ganache-cli -p 8545 --gasLimit 20000000 -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"`

`truffle compile`

`truffle migrate`

`npm run server`

`npm run dapp`

`visit http://localhost:8000`

## Architecture
The data persistence smart contracts have been refactored; 
- `AirlineData` for the Airlines (voting, status, etc.)
- `FlightData` for the flights and passengers

The testing suite reflects this, with unit testing on each contract seperated. 
- `test\application.js` Integration test, representing the DAPP
    - `test\airlines.js` Unit test, for airline data
    - `test\flights.js` Unit test, for passengers and flights data

The upgradeability is enforced through the interface contracts found in `FlightSuretyApp.sol`. 

## Governance
### Airlines
Each airline is represented by their public address. 
Airlines have various status codes to represent their state in the contract.
- Proposed
- Registered
- Funded

### Passengers

# Smart contract development
## Notes
NB: Do not use HDWalletProvider! Major errors with multiple deployments, very slow with Ganache, etc.

## Ganache testing
Start ganache with the same seed phrase as specified in truffle configuration `truffle.js`.

`ganache-cli -p 8545 --gasLimit 20000000 -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"`

## Faster testing
Run `truffle develop` to start the development blockchain (not ganache)

At the develop console, run `test` to run all tests, or `test ./test/testscript.js` to run a single test.

# Server development
The server simulates the oracle information.

# Front end development

## Sections
A transaction log lists all state changes in the blockchain, as called from the DAPP. The log starts with the testing configuration defaults. 
![logs](doc/transactionlog.png)
A table of all existing airlines is populated from the blockchain data. 
![airlines](doc/airlines.png)
Similarly, all flights in the `flightData` smart contract are populated. A flight is selected from the dropdown for insurance purchase. 
![flights](doc/flights.png)
The default testing passenger account selects the insurance amount for the selected flight. 
![passengers](doc/passengers.png)
Finally, the Oracle simulation can proceed, calling the payment processing if the flight is delayed. 

-----

# FlightSurety (Boilerplate code section)

FlightSurety is a sample application project for Udacity's Blockchain course.

## Install
This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install, download or clone the repo, then:

`npm install`

`truffle compile`

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`

`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`

`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`

`truffle test ./test/oracles.js`

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)