import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import AirlineData from '../../build/contracts/AirlineData.json';
import FlightData from '../../build/contracts/FlightData.json';
import PassengerData from '../../build/contracts/PassengerData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {
        console.log('Contract class');

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.airlineData = new this.web3.eth.Contract(AirlineData.abi, config.airlineDataAddress);
        this.flightData = new this.web3.eth.Contract(FlightData.abi, config.flightDataAddress);
        this.passengerData = new this.web3.eth.Contract(PassengerData.abi, config.passengerDataAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];

            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    getNumAirlines(callback) {
        let self = this;
        self.airlineData.methods.getNumAirlines()
            .call({ from: self.owner}, callback);
    }

    // getAirlinesList()

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }
}