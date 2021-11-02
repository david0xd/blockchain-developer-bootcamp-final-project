pragma solidity >=0.5.16 <0.9.0;

/**
* Document Signer Smart Contract
*/
contract DocumentSigner {

    struct Document {
        string documentHash;
        string name;
        string description;
        address owner;
        uint256 createdAt;
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

    modifier documentDoesNotExist(string documentHash) {
        require(documents[documentHash].createdAt == 0, "Document has been already added.");
        _;
    }

    /**
    * Add new document hash to the smart contract storage.
    *
    * returns bool
    */
    function addDocument(string documentHash, string name, string description) external
    documentDoesNotExist(documentHash) returns (bool) {
        documents[documentHash] = Document({
            documentHash: documentHash,
            name: name,
            description: description,
            owner: msg.sender,
            createdAt: block.timestamp
        });
        return documents[documentHash];
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
