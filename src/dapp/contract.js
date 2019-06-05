import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import AirlineData from '../../build/contracts/AirlineData.json';
import FlightData from '../../build/contracts/FlightData.json';
import PassengerData from '../../build/contracts/PassengerData.json';
import Config from './config.json';
import Web3 from 'web3';
var BigNumber = require('big-number');

var Test = require('./testConfig.js');
export default class Contract {
    constructor(network, callback) {
        let demoConfig = Test.Config();
        window.demoConfig = demoConfig;

        console.log('Constructor: contract class');
        console.log(`Testing config: ${Test}`);
        // console.log(`owner ${demoConfig.owner}`);
        // console.log(`airlines ${demoConfig.testAirlineAccounts}`);
        // console.log(`passengers ${demoConfig.testPassengerAccounts}`);
        // console.log(`other ${demoConfig.testOtherAccounts}`);

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.airlineData = new this.web3.eth.Contract(AirlineData.abi, config.airlineDataAddress);
        this.flightData = new this.web3.eth.Contract(FlightData.abi, config.flightDataAddress);
        this.passengerData = new this.web3.eth.Contract(PassengerData.abi, config.passengerDataAddress);
        this.owner = null;
        this.owner = demoConfig.owner;
        // this.airlines = [];
        // this.passengers = [];
        this.passengers = demoConfig.testPassengerAccounts;
        this.airlines = demoConfig.testAirlineAccounts;
        // this.initializeAccounts(callback);
        // this.initializeAirlines(callback);

        // console.log(`owner ${this.owner}`);
        this.authorizeApp(config.appAddress, callback);
    }

    // initializeAccounts(callback) {
    //     this.web3.eth.getAccounts((error, accts) => {
    //         this.owner = demoConfig.owner;

    //         // let counter = 1;

    //         // while(this.airlines.length < 5) {
    //         //     this.airlines.push(accts[counter++]);
    //         // }
    //         this.testAirlineAccounts = demoConfig.testAirlineAccounts;

    //         // while(this.passengers.length < 5) {
    //         //     this.passengers.push(accts[counter++]);
    //         // }
    //         this.passengers = demoConfig.testPassengerAccounts;

    //         callback();
    //     });
    // }

    // async initializeAirlines(callback) {
    //     let self = this;
    //     self.airlineData.methods.getNumAirlines().call({ from: self.owner }, (error, result) => {
    //         // console.log("TEST1", error, result, typeof(result), result.toNumber() );
    //         console.log(`Number airlines: ${result.toNumber()}`);
    //     });
    //     // console.log("asdf", self.testAirlineAccounts[1]);
    //     // console.log(self.flightSuretyApp.methods.registerAirline('Airline 2', self.airlines[1]).send({ from: self.owner }, callback));
    //     self.airlineData.methods.getNumAirlines().call({ from: self.owner }, (error, result) => {
    //         // console.log("TEST1", error, result, typeof(result), result.toNumber() );
    //         console.log(`Number airlines: ${result.toNumber()}`);
    //     });
    //     // tx = await self.flightSuretyApp.registerAirline('Airline 2', self.testAirlineAccounts[1], {from: self.testAirlineAccounts[0]})

    //     // callback();

    // }

    /****************************************/
    // Utitlies
    /****************************************/
    authorizeApp(appAddress, callback) {
        let self = this;
        self.airlineData.methods
            .authorizeCaller(appAddress)
            .send({ from: self.owner, gas: 4712388, gasPrice: 100000000000 }, callback);

            // TODO: No auth reqd
        // self.flightData.methods
        //     .authorizeCaller(appAddress)
        //     .send({ from: self.owner, gas: 4712388, gasPrice: 100000000000 }, callback);
        // self.passengerData.methods
        //     .authorizeCaller(appAddress)
        //     .send({ from: self.owner, gas: 4712388, gasPrice: 100000000000 }, callback)    
        }

    isOperational(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner }, callback);
    }

    /****************************************/
    // Airlines
    /****************************************/
    registerAirline(airlineName, applicantAirline, registeredAirline, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .registerAirline(airlineName, applicantAirline)
            .send({ from: registeredAirline, gas: 4712388, gasPrice: 100000000000 }, callback);
    }

    getNumAirlines(callback) {
        let self = this;
        self.airlineData.methods.getNumAirlines()
            .call({ from: self.owner }, callback);
    }


    getAirline(index, callback) {
        let self = this;
        self.airlineData.methods
            .airlineAddresses(index)
            .call({from: self.owner}, callback);
    }

    getAirlineDetails(addr, callback) {
        let self = this;
        self.airlineData.methods
        .getAirline(addr)
        .call({from: self.owner}, callback)
    }

    fundAirline(addr, callback) {
        let self = this;
        let fundingAmount = web3.toWei(10, "ether");
        self.flightSuretyApp.methods
        .fund()
        .send({from: addr, value: fundingAmount, gas: 4712388, gasPrice: 100000000000}, callback);

        // tx = await config.flightSuretyApp.fund({from: addr, value: fundingAmount})
    }


    /****************************************/
    // Flights
    /****************************************/
    getNumFlights(callback) {
        let self = this;
        self.flightData.methods.getNumFlights()
            .call({ from: self.owner }, callback);
    }

    getFlightKey(index, callback) {
        let self = this;
        self.flightData.methods
            .flightsList(index)
            .call({from: self.owner}, callback);
    }        





    getFlightByKey(fkey, callback) {
        let self = this;
        self.flightData.methods
        .getFlightByKey(fkey)
        .call({from: self.owner}, callback)
    }

    // getFlight(flight, callback) {
    //     let self = this;
    //     let payload = {
    //         airline: self.airlines[0],
    //         flight: flight,
    //         timestamp: Math.floor(Date.now() / 1000)
    //     }
    //     self.flightSuretyApp.methods
    //         .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
    //         .send({ from: self.owner }, (error, result) => {
    //             callback(error, payload);
    //         });
    // }


    registerFlight(name, time, airline, callback) {
    // tx = await config.flightSuretyApp.registerFlight(flightName, flightTime, {from: airline})
        let self = this;
        self.flightSuretyApp.methods
            .registerFlight(name, time)
            .send({from: airline, gas: 4712388, gasPrice: 100000000000}, callback);
        }

    /****************************************/
    // Passengers
    /****************************************/
}