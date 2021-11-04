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
        Signatory [] signatories;
        mapping (address => Signature) signatures;
    }

    struct Signatory {
        string firstName;
        string lastName;
        address signatoryAddress;
    }

    struct Signature {
        Signatory signatory;
        string description;
        uint256 createdAt;
    }

    /* Fully privileged smart contract owner */
    address public owner;
    /* Documents mapped by hash */
    mapping (string => Document) public documents;

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
    * Require that document does not exist.
    */
    modifier documentDoesNotExist(string documentHash) {
        require(documents[documentHash].createdAt == 0, "Document has been already added.");
        _;
    }

    /**
    * Require that document exist.
    */
    modifier documentExist(string documentHash) {
        require(documents[documentHash].createdAt != 0, "Document does not exist.");
        _;
    }

    /**
    * Require that call comes from document owner.
    */
    modifier onlyDocumentOwner(string documentHash) {
        require(
            documents[documentHash].owner == msg.sender,
            "Only owner is allowed to perform this kind of action over document.");
        _;
    }

    /**
    * Add new document to the smart contract storage.
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
    * Add new user (signatory) to the smart contract and allow them to sign a specified document.
    * Note: Only owner of a document can perform this action.
    *
    * returns bool
    */
    function addSignatory(string documentHash, address signatoryAddress, string firstName, string lastName)
    external documentExist(documentHash) onlyDocumentOwner(documentHash) returns (bool) {
        documents[documentHash].signatories.push(
            Signatory({
                firstName: firstName,
                lastName: lastName,
                signatoryAddress: signatoryAddress
            })
        );

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
        return documents[documentHash];
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
