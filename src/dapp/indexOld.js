
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async () => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error, result);
            display('Operational Status', 'Check if contract is operational',
                [{ label: 'Operational Status', error: error, value: result }]);
        });

        // Show registered airlines
        contract.getNumAirlines((error, res) => {
            console.log(error, res);

            for (var index = 0; index < res; index++) {
                contract.getRegisteredAirlieInfo(index, (error, result) => {
                    console.log(error, result);
                    display('Registered Airline', '', [{ label: 'Airline Name:', error: error, value: result[0] }, { label: 'Airline Address:', error: error, value: result[3] }]);
                    defaultAirlineAddress = result[3];
                });
            }
        });

        // sect2 = DOM.section()
        // section.appendChild(DOM.h1('Testing'));

        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles',
                    [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
                console.log(`contract.fetchFlightStatus(airline=${contract.airlines[0]} flight=${flight} timestamp=${result.timestamp}`);
            });

        })

    });

})();


function display(title, description, results) {
    console.log(`display(${title}, ${description}, ${results})`);

    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({ className: 'row' }));
        row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
        row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}