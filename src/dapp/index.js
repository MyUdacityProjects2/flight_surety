// import DOM from './dom.js';
// import DOM from 'dom';

import DOM from './dom';
import Contract from './contract';
// import Contract from './mocktract';
import './flightsurety.css';
var Test = require('./testConfig.js');
let demoConfig = Test.Config();

// let mockAirlines = [
//   { name: 'airline1', addr: '0x1' },
//   { name: 'airline2', addr: '0x2' },
//   { name: 'airline3', addr: '0x3' }
// ];

let mockFlights = [
  { name: 'flight1', addr: '0x1' },
  { name: 'flight2', addr: '0x2' },
  { name: 'flight3', addr: '0x3' }
];

(async () => {
  console.log('Starting main script');

  let contract = new Contract('localhost', () => {

    // Read transaction
    contract.isOperational((error, result) => {
      console.log(error, result);
      display('Operational Status', 'Check if contract is operational',
        [{ label: 'Operational Status', error: error, value: result }]);
    });

    // Show registered airlines
    contract.getNumAirlines((error, result) => {
      console.log(error, result);
    });

    // // Show registered airlines
    // contract.getNumAirlines((error, res) => {
    //     console.log(error, res);
    //     for (var index = 0; index < res; index++) {
    //         contract.getRegisteredAirlieInfo(index, (error, result) => {
    //             console.log(error, result);
    //             display('Registered Airline', '', [{ label: 'Airline Name:', error: error, value: result[0] }, { label: 'Airline Address:', error: error, value: result[3] }]);
    //             defaultAirlineAddress = result[3];
    //         });
    //     }
    // });

    // sect2 = DOM.section()
    // section.appendChild(DOM.h1('Testing'));

    // // User-submitted transaction
    // DOM.elid('submit-oracle').addEventListener('click', () => {
    //     let flight = DOM.elid('flight-number').value;
    //     // Write transaction
    //     contract.fetchFlightStatus(flight, (error, result) => {
    //         display('Oracles', 'Trigger oracles',
    //             [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
    //         console.log(`contract.fetchFlightStatus(airline=${contract.airlines[0]} flight=${flight} timestamp=${result.timestamp}`);
    //     });
    // })

  });
  window.contract = contract;

  // Assign all buttons
  DOM.elid("update-airlines").addEventListener('click', () => { updateAirlinesTable() });
  DOM.elid("<Update Flights>").addEventListener('click', () => { updateFlights() });
  DOM.elid("flights-dropdown").addEventListener('change', () => { selectFlight() });
  DOM.elid("buy-insurance").addEventListener('click', () => { buyInsurance() });
  DOM.elid("simulate").addEventListener('click', () => { simulate() });
  DOM.elid("check-payout").addEventListener('click', () => { checkPayout() });
  DOM.elid("payout").addEventListener('click', () => { payout() });
  // Register initial airlines
  registerAirline('Blockchain Air', contract.airlines[1], contract.airlines[0]);
  registerAirline('Ethereum Air', contract.airlines[2], contract.airlines[0]);
  registerAirline('Solidity Air', contract.airlines[3], contract.airlines[0]);
  fundAirline(contract.airlines[0]);
  fundAirline(contract.airlines[1]);
  updateAirlinesTable();

  // Register initial flights
  registerFlight('GenAir22', 1230, contract.airlines[0]);
  registerFlight('GenAir100', 1630, contract.airlines[0]);
  registerFlight('BCA111', 1000, contract.airlines[1]);
  registerFlight('BCA44', 1900, contract.airlines[1]);
  // registerFlight('EA966', 1000, contract.airlines[2]);
  // registerFlight('SA22', 1000, contract.airlines[2]);
  updateFlights();

  // Initial passengers
  registerPassenger(contract.passengers[0]);


})();

/****************/
/*** Airlines ***/
/****************/
function updateAirlinesTable() {
  console.log('airlinesWrite()');

  let numtext = DOM.elid("number-airlines")
  // console.log(numtext);
  let num;
  function callback(error, result) {
    if (error) {
      // console.log('ERROR in Num airlines', error);
    } else {

      num = result.toNumber()
      numtext.innerHTML = `Number of airlines: ${num}`

      let rows = [];
      for (let i = 0; i < num; i++) {
        // console.log(i);

        contract.getAirline(i, (error, result) => {
          let thisAirlineAddress = result;
          // console.log(i, thisAirlineAddress);

          contract.getAirlineDetails(thisAirlineAddress, (err, res) => {
            let name = res[0];
            let address = res[1];
            let state = res[2];
            let votes = res[3];

            let stateMap = {
              0: 'Proposed',
              1: 'Registered',
              2: 'Funded'
            }

            rows.push(`<tr><td>${name}<td>${address}<td>${stateMap[state]}</td><td>${votes}</td></tr>`)
            let allRows = rows.join("")

            let t1 = document.getElementById("airlinesTable");
            t1.innerHTML = allRows;

          });

        });
      }
    }
  }
  contract.getNumAirlines(callback);
}

function registerAirline(airlineName, airline, registeredAirline) {
  // console.log('registerAirline');

  function callback(error, result) {
    let msg = 'Registering Airlines for testing: ' + airlineName;
    if (error) {
      display('', '', [{ label: msg, error: airline + " This address already registered!" }], false);
    } else {
      display('', '', [{ label: msg, value: "Successful!" }], false);
    }
  }

  contract.registerAirline(airlineName, airline, registeredAirline, callback);
}

function fundAirline(airline) {
  function callback(error, result) {
    let msg = 'Funding Airline for testing: ' + airline;
    if (error) {
      display('', '', [{ label: msg, error: "Already funded!" }], false);
    } else {
      display('', '', [{ label: msg, value: "Successful!" }], false);
    }
  }

  contract.fundAirline(airline, callback);
}

/***************/
/*** Flights ***/
/***************/
function registerFlight(name, time, airline) {
  function callback(error, result) {
    let msg = 'Registered flight for testing: ' + name + " at " + time;
    if (error) {
      display('', '', [{ label: msg, error: "Flight already registered!" }], false);
      // console.log(error);

    } else {
      display('', '', [{ label: msg, value: "Successful!" }], false);
    }
  }
  contract.registerFlight(name, time, airline, callback)
}

// function updateFlightsDropdown() {
//   console.log('updateFlightsDropdown()');

//   // Get all flights
//   let _flights = flightsGet();

//   // Select the dropdown and text element
//   let dr1 = document.getElementById("flights dropdown");

//   // Build the dropdowns
//   let items = [];
//   for (var fl of _flights) {
//     items.push(`<option value="${fl.name}">${fl.name}</option>`);
//   }
//   let allItems = items.join("");
//   dr1.innerHTML = allItems;
// }

function updateFlights() {
  let numtext = DOM.elid("number-flights");
  // console.log(numtext);

  function callback(error, result) {
    if (error) {
      console.log('ERROR in Num flights', error);
    } else {

      let num = result.toNumber()
      numtext.innerHTML = `Number of flights: ${num}`

      let i = 0;
      let dr1 = document.getElementById("flights-dropdown");
      let items = [];
      items.push(`<option value="-1" name="Nonde">Select flight</option>`);
      for (i; i < num; i++) {
        let thisFlight = contract.getFlightKey(i, (err, res) => {
          let fkey = res;
          contract.getFlightByKey(fkey, (err, res) => {

            let flightName = res[0];
            let isRegistered = res[1];
            let statusCode = res[2];
            let departureTime = res[3].toNumber();
            let airline = res[4];
            // console.log("ASDF", fkey, flightName, isRegistered, statusCode, departureTime, airline);
            items.push(`<option value="${fkey}" name="${flightName}">${flightName} at ${departureTime}</option>`);
            let allItems = items.join("");
            dr1.innerHTML = allItems;
          })

        });
      }

    }
  }

  contract.getNumFlights(callback)
}

function flightsGet() {
  return mockFlights;
}

function selectFlight() {
  // console.log('selectFlight()');

  // Get flight from dropdown
  var thisFlightKey = document.getElementById("flights-dropdown").value;
  // var thisFlightName = document.getElementById("flights-dropdown").name;

  // Select the header text tag
  let t1 = document.getElementById("selectedFlight")
  t1.innerHTML = `(Selected flight key: ${thisFlightKey})`

  // Select the buy button
  let btext = DOM.elid("buy-insurance")
  // btext.value = `Buy insurance for selected flight? (${thisFlightKey}?)`
  btext.value = `Buy insurance for selected flight?`
}

function test() {
  let v1 = 2;
  contract.isOperational((error, result) => { v1 = result });
  // v1=2;
  return v1;
}

window.test = test;

/******************/
/*** Passengers ***/
/******************/

function registerPassenger(passengerAddress) {
  DOM.elid("passenger-pubkey").innerHTML = passengerAddress;
}


function buyInsurance() {
  let thisFlight = DOM.elid("flights-dropdown").value;
  let thisAmount = DOM.elid("amounts").value;
  if (thisAmount === '-1') {
    window.alert("Select an insurance amount!");
    return;
  } else if (thisFlight === '-1') {
    window.alert("Select a flight!");
  } else {
    let msg = `Purchasing ${thisAmount} insurance for ${thisFlight}`
    DOM.elid("insurance-amount").innerHTML = thisAmount;
    displayBottom('', '', [{ label: msg, value: "Successful!" }], false);
  }
}

function checkPayout() {
  let currentInsuranceAmount = DOM.elid("insurance-amount").innerHTML;
  
  if (currentInsuranceAmount === '0') {
    window.alert("No insurance available!");
    return;
  } else {
    DOM.elid("insurance-amount").innerHTML = '0';
    DOM.elid("payout-amount").innerHTML = currentInsuranceAmount;
  }

}

function payout() {
  let currentPayoutAmount = DOM.elid("payout-amount").innerHTML;
  
  if (currentPayoutAmount === '0') {
    window.alert("No payout available!");
    return;
  } else {
    DOM.elid("payout-amount").innerHTML = '0';

    let msg = `Passenger recieved ${currentPayoutAmount} insurance payout`
    displayBottom('', '', [{ label: msg, value: "Successful!" }], false);
  }

}

/******************/
/*** Oracles ***/
/******************/
function simulate() {
  let msg = 'Simulating flight status update... '
  displayBottom('', '', [{ label: msg, value: "Successful!" }], false);

}
/*************/
/*** Other ***/
/*************/
function showCommentForm() {
  var data = "Name:<input type='text' name='name'><br>Comment:<br><textarea rows='5' cols='80'></textarea><br><input type='submit' value='Post Comment'>"
  document.getElementById("mylocation").innerHTML = data;
}


function getCube() {
  var number = document.getElementById("number").value;
  alert(number * number * number);
}


function display(title, description, results, updateFlag) {
  let displayDiv = DOM.elid("display-wrapper");
  if (updateFlag) {
    displayDiv.innerHTML = "";
  }
  let section = DOM.section();
  if (!title && !description) {
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
  }
  results.map((result) => {
    let row = section.appendChild(DOM.div({ className: 'row' }));
    row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
    if (result.error) {
      row.appendChild(DOM.div({ className: 'col-sm-8 field-value-error' }, String(result.error)));
    } else {
      row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, String(result.value)));
    }
    section.appendChild(row);
  })
  displayDiv.append(section);
}


function displayBottom(title, description, results, updateFlag) {
  let displayDiv = DOM.elid("display-wrapper2");
  if (updateFlag) {
    displayDiv.innerHTML = "";
  }
  let section = DOM.section();
  if (!title && !description) {
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
  }
  results.map((result) => {
    let row = section.appendChild(DOM.div({ className: 'row' }));
    row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
    if (result.error) {
      row.appendChild(DOM.div({ className: 'col-sm-8 field-value-error' }, String(result.error)));
    } else {
      row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, String(result.value)));
    }
    section.appendChild(row);
  })
  displayDiv.append(section);
}
