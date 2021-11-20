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
        string algorithm;
        uint256 createdAt;
    }

    struct Signatory {
        string fullName;
        string description;
        address signatoryAddress;
        uint256 signedAt;
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
    * @param documentHash Hash of a document to check
    */
    modifier documentDoesNotExist(string memory documentHash) {
        require(documents[documentHash].owner == address(0), "Document has been already added.");
        _;
    }

    /**
    * Require that document exist.
    * @param documentHash Hash of a document to check
    */
    modifier documentExist(string memory documentHash) {
        require(documents[documentHash].owner != address(0), "Document does not exist.");
        _;
    }

    /**
    * Require that the signatory is added to a document.
    *
    * @param documentHash Hash of a document to check
    * @param signatoryAddress Address of a signatory
    */
    modifier signatoryExist(string memory documentHash, address signatoryAddress) {
        require(
            documents[documentHash].addedSignatories[signatoryAddress] == true,
            "Signatory is now allowed to sign specified document."
        );
        _;
    }

    /**
    * Require that signatory does not exists within a document.
    *
    * @param documentHash Hash of a document to check
    * @param signatoryAddress Address of a signatory
    */
    modifier signatoryDoesNotExist(string memory documentHash, address signatoryAddress) {
        require(
            documents[documentHash].addedSignatories[signatoryAddress] == false,
            "Signatory is already added to a document. The requested operation can be executed only once."
        );
        _;
    }

    /**
    * Require that the signatory did not sign a specified document.
    *
    * @param documentHash Hash of a document to check
    * @param signatoryAddress Address of a signatory
    */
    modifier signatoryDidNotSign(string memory documentHash, address signatoryAddress) {
        require(
            documents[documentHash].signatures[signatoryAddress] == false,
            "Signatory have already signed the specified document."
        );
        _;
    }

    /**
    * Require that call comes from document owner.
    * @param documentHash Hash of a document to check
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
    * @param documentHash Hash of a document to add
    * @param name Name of a document
    * @param description Arbitrary description of a document
    * @param algorithm Algorithm that the document is hashed with
    *
    * returns bool
    */
    function addDocument(string calldata documentHash,
        string calldata name,
        string calldata description,
        string calldata algorithm) external
    documentDoesNotExist(documentHash) returns (bool) {
        documents[documentHash].documentHash = documentHash;
        documents[documentHash].name = name;
        documents[documentHash].description = description;
        documents[documentHash].owner = msg.sender;
        documents[documentHash].algorithm = algorithm;
        documents[documentHash].createdAt = block.timestamp;

        emit DocumentAdded(documentHash);

        return true;
    }

    /**
    * Add new user (signatory) to the smart contract and allow them to sign a specified document.
    * Note: Only owner of a document can perform this action.
    *
    * @param documentHash Hash of a document to check
    * @param signatoryAddress Address of a signatory to allow to sign specified document
    * @param fullName Full name of a signatory that can be used to identify a person
    * @param description Arbitrary description of a signatory or their role (i.e. director, employee, seller, etc.)
    *
    * returns bool
    */
    function addSignatory(
        string calldata documentHash,
        address signatoryAddress,
        string calldata fullName,
        string calldata description
    ) external
    documentExist(documentHash)
    onlyDocumentOwner(documentHash)
    signatoryDoesNotExist(documentHash, signatoryAddress)
    returns (bool) {
        documents[documentHash].signatories.push(
            Signatory({
                fullName: fullName,
                description: description,
                signatoryAddress: signatoryAddress,
                signedAt: 0
            })
        );
        documents[documentHash].addedSignatories[signatoryAddress] = true;
        emit SignatoryAdded(documentHash, signatoryAddress);

        return true;
    }

    /**
    * Add signature to the document specified by a document hash.
    *
    * @param documentHash Hash of a document to sign
    *
    * returns bool
    */
    function signDocument(string calldata documentHash)
    external
    documentExist(documentHash)
    signatoryExist(documentHash, msg.sender)
    signatoryDidNotSign(documentHash, msg.sender)
    returns (bool) {
        // TODO: Check if signatory already signed the document
        // Mark document as signed
        documents[documentHash].signatures[msg.sender] = true;

        // Update signature timestamp
        Signatory [] memory signatories = documents[documentHash].signatories;

        for (uint i = 0; i < signatories.length; i++) {
            if (signatories[i].signatoryAddress == msg.sender) {
                documents[documentHash].signatories[i].signedAt = block.timestamp;
            }
        }

        emit DocumentSigned(documentHash, msg.sender);

        return true;
    }

    /**
    * Get signatories added to the document.
    *
    * @param documentHash Hash of a document of which signatories are requested
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
    * @param documentHash Hash of a document related to the signatory
    * @param signatoryAddress Address of a signatory of which info is requested
    *
    * returns (string fullName, string description)
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
    * @param documentHash Hash of a document of which to retrieve signatures
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
