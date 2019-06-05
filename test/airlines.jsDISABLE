// Simple logging util
var path = require('path');
var scriptName = path.basename(__filename);
function log(_string){
    // console.log(`${scriptName}: ${_string}`);
}

// Begin main test script
const truffleAssert = require('truffle-assertions'); // Extra utilities for testing Smart Contracts

log('Starting airlines.js tests, top of script.');
var Test = require('../config/testConfig.js');


contract('Airline Requirement Tests', async (accounts) => {

  log('airlines.js: Initiating contract')
  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);

    // Give airlines permission to call the contract directly, for testing
    config.airlineData.authorizeCaller(config.testAirlineAccounts[0], {from: config.owner}) 
    config.airlineData.authorizeCaller(config.testAirlineAccounts[1], {from: config.owner}) 
    config.airlineData.authorizeCaller(config.testAirlineAccounts[2], {from: config.owner}) 
    config.airlineData.authorizeCaller(config.testAirlineAccounts[3], {from: config.owner}) 
    config.airlineData.authorizeCaller(config.testAirlineAccounts[4], {from: config.owner}) 
  });


  it(`First airline is registered when contract is deployed`, async function () {
    // Constructor should register an airline
    numAirlines = await config.airlineData.getNumAirlines();
    assert.equal(numAirlines, 1, "One airline registered");
    thisAirline = await config.airlineData.getAirline(config.testAirlineAccounts[0]) 
    log(`First airline: name=${thisAirline[0]}, address=${thisAirline[1]}, state=${thisAirline[2]}, votes=${thisAirline[3]}`)
    assert.equal(thisAirline[1], config.testAirlineAccounts[0], 'First airline not matching configuration')
  });


  it(`Only existing airline may register a new airline until there are at least four airlines registered`, async function () {
    // Register 2
    tx = await config.airlineData.registerAirline('Airline 2', config.testAirlineAccounts[1], {from: config.testAirlineAccounts[0]})
    truffleAssert.eventEmitted(tx, 'AirlineRegisteredData', (ev) => { return ev.name === 'Airline 2' });
    assert.equal(await config.airlineData.getNumAirlines(), 2, "Two are not registered");

    // Register 3
    tx = await config.airlineData.registerAirline('Airline 3', config.testAirlineAccounts[2], {from: config.testAirlineAccounts[1]})

    log(`Second airline: ${await config.airlineData.getAirline(config.testAirlineAccounts[1]) }`)
    log(`Third airline: ${await config.airlineData.getAirline(config.testAirlineAccounts[2]) }`)

    // Fail to register 4, because the sender is not registered
    await truffleAssert.reverts(
      config.airlineData.registerAirline('Airline 4', config.testAirlineAccounts[3], {from: config.testAirlineAccounts[4]}), 
      "Only existing airlines can register new"
      )

    // Go ahead and register 4 from a registered airline
    tx = await config.airlineData.registerAirline('Airline 4', config.testAirlineAccounts[3], {from: config.testAirlineAccounts[2]})
    log(`Fourth airline: ${await config.airlineData.getAirline(config.testAirlineAccounts[3]) }`)
    
  });


  it(`Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines`, async function () {
    log(`Number of airlines: ${await config.airlineData.getNumAirlines()}`)

    // Go ahead and propose a 5th airline, sponsor automatically votes
    tx = await config.airlineData.registerAirline('Airline 5', config.testAirlineAccounts[4], {from: config.testAirlineAccounts[2]})
    truffleAssert.eventEmitted(tx, 'AirlineProposed');
    thisAirline = await config.airlineData.getAirline(config.testAirlineAccounts[4])
    log(`Fifth airline, sponsor is first vote: name=${thisAirline[0]}, state=${thisAirline[2]}, votes=${thisAirline[3]}`)

    // Try and vote again
    await truffleAssert.reverts(
      config.airlineData.vote(config.testAirlineAccounts[4], {from: config.testAirlineAccounts[2]}),
      'You have already voted for this airline'
    )

    // Add another vote
    await config.airlineData.vote(config.testAirlineAccounts[4], {from: config.testAirlineAccounts[3]})
    thisAirline = await config.airlineData.getAirline(config.testAirlineAccounts[4])
    log(`Fifth airline, another vote: name=${thisAirline[0]}, state=${thisAirline[2]}, votes=${thisAirline[3]}`)
    
    // Add another vote, assert voted
    tx = await config.airlineData.vote(config.testAirlineAccounts[4], {from: config.testAirlineAccounts[1]})
    
    truffleAssert.eventEmitted(tx, 'VotedIn');
    thisAirline = await config.airlineData.getAirline(config.testAirlineAccounts[4])
    log(`Fifth airline, another vote: name=${thisAirline[0]}, state=${thisAirline[2]}, votes=${thisAirline[3]}`)

    assert.equal(thisAirline[2], 1, 'This airline should be status=registered')
    assert.equal(await config.airlineData.getNumRegisteredAirlines(), 5, '5 airlines should be registered')
  });

  it(`Airline can be registered, but does not participate in contract until it submits funding of 10 ether`, async function () {
    // Only registered airlines can fund
    await truffleAssert.reverts(
      config.airlineData.fundAirline({from: config.testAirlineAccounts[2], value: 1}),
      'Minimum funding level not met'
    )
    let fundingAmount = web3.toWei(10, "ether")
    tx = await config.airlineData.fundAirline({from: config.testAirlineAccounts[2], value: fundingAmount})
    truffleAssert.eventEmitted(tx, 'AirlineFunded');

    thisAirline = await config.airlineData.getAirline(config.testAirlineAccounts[2])
    log(`This airline is funded: name=${thisAirline[0]}, state=${thisAirline[2]}, votes=${thisAirline[3]}`)
  });

});
