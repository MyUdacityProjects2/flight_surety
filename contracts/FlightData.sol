pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    mapping(address => bool) private authorizedContracts;

    /* FLIGHTS
    */
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    struct Flight {
        string flightName;
        bool isRegistered;
        uint8 statusCode;
        uint256 departureTime;
        address airline;
    }
    mapping(bytes32 => Flight) private flights;
    bytes32[] public flightsList;


    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    /********************************************************************************************/
    /*                                       CONSTUCTOR                                         */
    /********************************************************************************************/

    /**
    * @dev Constructor
    *      
    */
    constructor () public
    {
        contractOwner = msg.sender;

    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational()
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
    * @dev Modifier that requires function caller to be authorized caller.
    */
    modifier requireCallerAuthorized()
    {
        require(authorizedContracts[msg.sender] == true, "Caller is not authorized caller");
        _;
    }


    modifier requireFlightExists(bytes32 _fkey)
    {
        bool exists = flightInList(flightsList, _fkey);
        require(exists, "Flight does not exist in this contract");
        _;
    }

    modifier requireFlightNotExists(bytes32 _fkey)
    {
        bool exists = flightInList(flightsList, _fkey);
        require(!exists, "Flight already exists!");
        _;
    }    


    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */
    function isOperational() public view returns(bool)
    {
        return operational;
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */
    function setOperatingStatus ( bool mode) external requireContractOwner
    {
        operational = mode;
    }

    function flightInList ( bytes32[] memory keys, bytes32 keyToCheck) internal pure returns(bool)
    {
        bool exists = false;
        for(uint c = 0; c < keys.length; c++) {
            if (keys[c] == keyToCheck) {
                exists = true;
                break;
            }
        }
        return exists;
    }

    /********************************************************************************************/
    /* FLIGHTS
    /********************************************************************************************/

    function registerFlight(address airline, string flightName, uint256 departureTime) 
                            external
                            returns (bytes32)
    {
        // uint256 updatedTimestamp = now;
        bytes32 flightKey = getFlightKey(airline, flightName, departureTime);
        require(!flightInList(flightsList, flightKey), 'Flight already exists!');

        flights[flightKey].flightName = flightName;
        flights[flightKey].isRegistered = true;
        flights[flightKey].statusCode = STATUS_CODE_UNKNOWN;
        flights[flightKey].departureTime = departureTime;        
        flights[flightKey].airline = airline;

        flightsList.push(flightKey);

        return flightKey;
    }

    function getFlight(address airline, string flightName, uint256 departureTime) external view
            returns (string, bool, uint8, uint256, address)
    {

        bytes32 flightKey = getFlightKey(airline, flightName, departureTime);
        require(flightInList(flightsList, flightKey));

        return(
            flights[flightKey].flightName, 
            flights[flightKey].isRegistered,
            flights[flightKey].statusCode,
            flights[flightKey].departureTime,
            flights[flightKey].airline
        );
    }

    function getNumFlights ( ) external view returns(uint flightCount)
    {
        return flightsList.length;
    }

    function getFlightByKey(bytes32 flightKey) external view requireFlightExists(flightKey) 
            returns (string, bool, uint8, uint256, address)
    {
        return(
            flights[flightKey].flightName, 
            flights[flightKey].isRegistered,
            flights[flightKey].statusCode,
            flights[flightKey].departureTime,
            flights[flightKey].airline
        );
    }


    function updateFlight(address airline, string flightName, uint256 departureTime, uint8 newStatusCode) external 
    {
        bytes32 flightKey = getFlightKey(airline, flightName, departureTime);
        require(flightInList(flightsList, flightKey));

        flights[flightKey].statusCode = newStatusCode;
    }


   /**
    * @dev Buy insurance for a flight
    *
    */
    function buy () external payable
    {

    }

    /**
    * @dev Credits payouts to insurees
    */
    function creditInsurees () external pure
    {
    }


    /**
     * @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */
    function fund () public payable
    {
    }

    function getFlightKey (address airline, string memory flight, uint256 timestamp) pure internal returns(bytes32)
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() external payable
    {
        fund();
    }
}
