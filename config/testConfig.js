
// Simple logging util
var path = require('path');
var scriptName = path.basename(__filename);
function log(_string){
    // console.log(`${scriptName}: ${_string}`);
}




// Begin
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var AirlineData = artifacts.require("AirlineData");
var FlightData = artifacts.require("FlightData");
var PassengerData = artifacts.require("PassengerData");

var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    log('Preparing test configuration environment...')

    let owner = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
    log(`\t owner: ${owner}`)

    let testAirlineAccounts = [
        "0xf17f52151ebef6c7334fad080c5704d77216b732",
        "0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef",
        "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
        "0x0d1d4e623d10f9fba5db95830f7d3839406c6af2",
        "0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e"
    ];
    for (addr of testAirlineAccounts) {
        log(`\t airlines: ${addr}`)
    }

    let testPassengerAccounts = [ 
        "0x2191ef87e392377ec08e7c08eb105ef5448eced5",
        "0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5",
        "0x6330a553fc93768f612722bb8c2ec78ac90b3bbc",
        "0x5aeda56215b167893e80b4fe645ba6d5bab767de",
        "0xe44c4cf797505af1527b11e4f4c6f95531b4be24",
    ];
    for (addr of testPassengerAccounts) {
        log(`\t passengers: ${addr}`)
    }

    let testOtherAccounts = [
        "0x69e1cb5cfca8a311586e3406ed0301c06fb839a2",
        "0xf014343bdffbed8660a9d8721dec985126f189f3",
        "0x0e79edbd6a727cfee09a2b1d0a59f7752d5bf7c9",
        "0x9bc1169ca09555bf2721a5c9ec6d69c8073bfeb4",
        "0xa23eaef02f9e0338eecda8fdd0a73add781b2a86",
        "0xc449a27b106be1120bd1fd62f8166a2f61588eb9",
        "0xf24ae9ce9b62d83059bd849b9f36d3f4792f5081",
        "0xc44b027a94913fb515b19f04caf515e74ae24fd6",
        "0xcb0236b37ff19001633e38808bd124b60b1fe1ba"
    ];
    for (addr of testOtherAccounts) {
        log(`\t others: ${addr}`)
    }

    let airlineData = await AirlineData.new('Genesis Air', testAirlineAccounts[0]);
    let passengerData = await PassengerData.new();
    let flightData = await FlightData.new();
    let flightSuretyApp = await FlightSuretyApp.new(airlineData.address, flightData.address, passengerData.address);
    log(`flightSuretyApp = ${flightSuretyApp}`)
    log(`airlineData = ${airlineData}`)
    log(`flightData = ${flightData}`)


    log('Test configuration environment loaded.');
    return {
        owner: owner,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAirlineAccounts: testAirlineAccounts,
        testPassengerAccounts: testPassengerAccounts,
        testOtherAccounts: testOtherAccounts,
        airlineData: airlineData,
        flightData: flightData,
        passengerData: passengerData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};