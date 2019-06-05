// Simple logging util
const sha3 = require('js-sha3').keccak_256

var path = require('path');
var scriptName = path.basename(__filename);
function log(_string){
    console.log(`${scriptName}: ${_string}`);
}

// Begin main test script
const truffleAssert = require('truffle-assertions'); // Extra utilities for testing Smart Contracts

// var FlightData = artifacts.require("FlightData");
var Test = require('../config/testConfig.js');

contract('Passenger Tests', async (accounts) => {

  var config;

  before('setup contract', async () => {
    config = await Test.Config(accounts);
    // Authorize the DApp to modify data
    config.airlineData.authorizeCaller(config.flightSuretyApp.address, {from: config.owner})
  });  

  it(`Test 1`, async function () {
  });


});
