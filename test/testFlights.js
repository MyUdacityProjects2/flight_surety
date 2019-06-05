// Simple logging util
const sha3 = require('js-sha3').keccak_256

var path = require('path');
var scriptName = path.basename(__filename);
function log(_string){
    console.log("\x1b[2m%s\x1b[0m", `\t${scriptName}: ${_string}`);
}

// Begin main test script
const truffleAssert = require('truffle-assertions'); // Extra utilities for testing Smart Contracts

var Test = require('../config/testConfig.js');

contract('Flight Tests', async (accounts) => {

  var config;

  before('setup contract', async () => {
    config = await Test.Config(accounts);
    // Authorize the DApp to modify data
    config.airlineData.authorizeCaller(config.flightSuretyApp.address, {from: config.owner})
    thisAirline = await config.airlineData.getAirline(config.testAirlineAccounts[0]) 
    let fundingAmount = web3.toWei(10, "ether")
    tx = await config.flightSuretyApp.fund({from: config.testAirlineAccounts[0], value: fundingAmount})
    truffleAssert.eventEmitted(tx, 'AirlineFunded');
    log(`First airline: name=${thisAirline[0]}, address=${thisAirline[1]}, state=${thisAirline[2]}, votes=${thisAirline[3]}`)
    
    // Create a second airline
    tx = await config.flightSuretyApp.registerAirline('Airline 2', config.testAirlineAccounts[1], {from: config.testAirlineAccounts[0]})
    tx = await config.flightSuretyApp.fund({from: config.testAirlineAccounts[1], value: fundingAmount})
  });  

  it(`Register a flight`, async function () {
    // Register
    let airline = config.testAirlineAccounts[0];
    let flightName = 'A111';
    let flightTime = 1000;
    tx = await config.flightSuretyApp.registerFlight(flightName, flightTime, {from: airline})
    log(`${tx.logs[0].event} key: ${tx.logs[0].args.flightKey} by: ${tx.logs[0].args.airline}`);
    assert(tx.logs[0].args.airline == config.testAirlineAccounts[0])

    let fkey = tx.logs[0].args.flightKey

    // Get a flight
    tx = await config.flightData.getFlight(airline, flightName, flightTime);
    tx = await config.flightData.getFlightByKey(fkey);
    log(tx) 

    // Ensure failure 
    await truffleAssert.reverts(
      config.flightData.getFlightByKey('0xb0997c61b36c05360cdaf044c5dd49e4cb52c4b8a6c01ac0efed709fbaa7fcdc'),
      "Flight does not exist in this contract")
  });

  it(`Update flight status`, async function () {
    let airline = config.testAirlineAccounts[0];
    let flightName = 'A111';
    let flightTime = 1000;
    let statusCode = 20;
    tx = await config.flightData.updateFlight(airline, flightName, flightTime, statusCode)

    tx = await config.flightData.getFlight(airline, flightName, flightTime);
    // tx = await config.flightData.getFlight.call(airline, flightName, flightTime);

    assert(tx[2] == 20)

  });

  it(`Triggers an oracle response`, async function () {
    let airline = config.testAirlineAccounts[1];
    let flightName = 'B222';
    let flightTime = 2000;
    tx = await config.flightSuretyApp.registerFlight(flightName, flightTime, {from: airline})
    tx = await config.flightSuretyApp.fetchFlightStatus(airline, flightName, flightTime)
    truffleAssert.eventEmitted(tx, 'OracleRequest');
  });

});
