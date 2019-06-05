import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

console.log('Starting the Oracle Simulation');
// console.log(`Config: ${JSON.stringify(config['localhost'])}`);

async function localTesting() {
  let fee = await flightSuretyApp.methods.REGISTRATION_FEE().call();
  console.log(`Registration fee: ${fee}`);

  let accounts = await web3.eth.getAccounts();
  // console.log(accounts);

  // arr.slice().reverse().forEach(function(x) { 
  //   console.log(x); 
  // })

  let oracleAccountStart = 20;
  console.log(`${oracleAccountStart} oracle accounts:`);
  
  accounts.slice(oracleAccountStart).forEach(function(x) { 
    console.log(`\t${x}`); 
  })

 }

localTesting();
console.log('Listening for FlightRegistered');


flightSuretyApp.events.OracleRequest({
  fromBlock: 0
}, function (error, event) {
  if (error) console.log(error)
  // console.log(event)

  let index = event.returnValues.index;
  let airline = event.returnValues.airline;
  let flight = event.returnValues.flight;
  let timestamp = event.returnValues.timestamp;
  // let statusCode = getRandomStatusCode();

  console.log("");
  console.log(`Airline: ${airline}`);
  console.log(`Flight: ${flight}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Index:" + ${index}`);
  // console.log(`Status code: ${statusCode}`);

});

flightSuretyApp.events.FlightRegistered({
  fromBlock: 0
}, function (error, event) {
  if (error) console.log(error)
  console.log(event)
});

const app = express();
app.get('/api', (req, res) => {
  res.send({
    message: 'An API for use with your Dapp!'
  })
})

export default app;


