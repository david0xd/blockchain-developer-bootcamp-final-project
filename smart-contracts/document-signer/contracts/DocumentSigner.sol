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
        Signatory [] signatories;
        mapping (address => bool) addedSignatories;
        mapping (address => bool) signatures;
    }

    struct Signatory {
        string fullName;
        string description;
        address signatoryAddress;
    }

    /* Documents mapped by hash */
    mapping (string => Document) public documents;

    /**
    * Events
    */
    event DocumentAdded(string indexed documentHash);
    event SignatoryAdded(string documentHash, address indexed signatoryAddress);
    event DocumentSigned(string documentHash, address indexed signatoryAddress);

    /**
    * Require that document does not exist.
    */
    modifier documentDoesNotExist(string memory documentHash) {
        require(documents[documentHash].owner == address(0), "Document has been already added.");
        _;
    }

    /**
    * Require that document exist.
    */
    modifier documentExist(string memory documentHash) {
        require(documents[documentHash].owner != address(0), "Document does not exist.");
        _;
    }

    /**
    * Require that document exist.
    */
    modifier signatoryExist(string memory documentHash, address signatoryAddress) {
        require(
            documents[documentHash].addedSignatories[signatoryAddress] == true,
            "Signatory is now allowed to sign specified document."
        );
        _;
    }

    /**
    * Require that call comes from document owner.
    */
    modifier onlyDocumentOwner(string memory documentHash) {
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
    function addDocument(string calldata documentHash, string calldata name, string calldata description) external
    documentDoesNotExist(documentHash) returns (bool) {
        documents[documentHash].documentHash = documentHash;
        documents[documentHash].name = name;
        documents[documentHash].description = description;
        documents[documentHash].owner = msg.sender;

        emit DocumentAdded(documentHash);

        return true;
    }

    /**
    * Add new user (signatory) to the smart contract and allow them to sign a specified document.
    * Note: Only owner of a document can perform this action.
    *
    * returns bool
    */
    function addSignatory(
        string calldata documentHash,
        address signatoryAddress,
        string calldata fullName,
        string calldata description
    ) external documentExist(documentHash) onlyDocumentOwner(documentHash) returns (bool) {
        documents[documentHash].signatories.push(
            Signatory({
                fullName: fullName,
                description: description,
                signatoryAddress: signatoryAddress
            })
        );
        documents[documentHash].addedSignatories[signatoryAddress] = true;
        emit SignatoryAdded(documentHash, signatoryAddress);

        return true;
    }

    /**
    * Add signature to the document specified by a document hash.
    */
    function signDocument(string calldata documentHash)
    external documentExist(documentHash) signatoryExist(documentHash, msg.sender) returns (bool) {
        documents[documentHash].signatures[msg.sender] = true;
        emit DocumentSigned(documentHash, msg.sender);

        return true;
    }

    /**
    * Get signatories added to the document.
    *
    * returns address []
    */
    function getSignatories(string memory documentHash) public view documentExist(documentHash)
    returns (address [] memory) {
        Signatory [] memory signatories = documents[documentHash].signatories;
        address [] memory addresses = new address [] (signatories.length);

        for (uint i = 0; i < signatories.length; i++) {
            Signatory memory signatory = signatories[i];
            addresses[i] = signatory.signatoryAddress;
        }

        return (addresses);
    }

    /**
    * Get signatory information.
    *
    * returns (string [] fullNames, string [] description)
    */
    function getSignatoryInformation(string memory documentHash, address signatoryAddress)
    public view documentExist(documentHash) signatoryExist(documentHash, signatoryAddress)
    returns (string memory, string memory) {
        Signatory [] memory signatories = documents[documentHash].signatories;

        string memory signatoryFullName;
        string memory signatoryDescription;

        for (uint i = 0; i < signatories.length; i++) {
            Signatory memory signatory = signatories[i];
            if (signatory.signatoryAddress == signatoryAddress) {
                signatoryFullName = signatory.fullName;
                signatoryDescription = signatory.description;
            }
        }

        return (signatoryFullName, signatoryDescription);
    }

    /**
    * Get document signatures in form of addresses of the signatories who signed the specified document.
    *
    * returns address []
    */
    function getSignatures(string calldata documentHash) external view documentExist(documentHash) returns (address [] memory) {
        uint256 totalSignatories = documents[documentHash].signatories.length;
        address [] memory signatures = new address[](totalSignatories);
        for (uint i = 0; i < totalSignatories; i++) {
            Signatory memory signatory = documents[documentHash].signatories[i];
            if (documents[documentHash].signatures[signatory.signatoryAddress] == true) {
                signatures[i] = signatory.signatoryAddress;
            }
        }

        return signatures;
    }
}
