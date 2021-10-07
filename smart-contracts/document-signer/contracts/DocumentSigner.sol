pragma solidity >=0.5.16 <0.9.0;

/**
* Document Signer Smart Contract
*/
contract DocumentSigner {

    struct Document {
        string documentHash;
        string name;
        string description;
    }

    struct Signatory {
        string firstName;
        string lastName;
        address signatoryAddress;
    }

    /* Fully privileged smart contract owner */
    address public owner;
    /* Documents mapped by hash */
    mapping (string => Document) public documents;
    /* Signatory array mapped by id */
    mapping (uint => Signatory) public signatories;

    constructor (){
        owner = msg.sender;
    }

    /**
    * Events
    */
    event DocumentAdded(string indexed documentHash);
    event SignatoryAdded(address indexed signatoryAddress, string documentHash);
    event DocumentSigned(address indexed signatoryAddress, string documentHash);

    /**
    * Modifiers
    */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
    * Add new document hash to the smart contract storage.
    *
    * returns bool
    */
    function addDocumentHash() external onlyOwner returns (bool) {
        // TODO: Add (register) document hash on the blockchain.
        return true;
    }

    /**
    * Add new user (signatory) to the smart contract and allow them to sign a certain document.
    *
    * returns bool
    */
    function addSignatory(string documentHash, address signatory) external returns (bool) {
        // TODO: Check document existence
        // TODO: Create signatory in storage & link signatory with the document

        return true;
    }

    /**
    * Add signature to the document specified by a document hash.
    */
    function signDocument(string documentHash, address signatory) external returns (bool) {
        // TODO: Add document signing logic
        return true;
    }

    /**
    * Get document information.
    *
    * returns Document
    */
    function getDocument(string documentHash) {
        // TODO: Return document info
        // TODO: Return document signatories
    }

    /**
    * Get signatories information.
    *
    * returns Signatory[]
    */
    function getSignatories(string documentHash) {
        // TODO: Return document signatories
    }
}
