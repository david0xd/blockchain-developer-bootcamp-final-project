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
        mapping (address => Signature) signatures;
    }

    struct Signatory {
        string firstName;
        string lastName;
        address signatoryAddress;
    }

    struct Signature {
        address signatoryAddress;
        string note;
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
        require(documents[documentHash].addedSignatories[signatoryAddress] == true);
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
    function addSignatory(string calldata documentHash, address signatoryAddress, string calldata firstName, string calldata lastName)
    external documentExist(documentHash) onlyDocumentOwner(documentHash) returns (bool) {
        documents[documentHash].signatories.push(
            Signatory({
                firstName: firstName,
                lastName: lastName,
                signatoryAddress: signatoryAddress
            })
        );
        documents[documentHash].addedSignatories[signatoryAddress] = true;

        return true;
    }

    /**
    * Add signature to the document specified by a document hash.
    */
    function signDocument(string calldata documentHash, string calldata note)
    external documentExist(documentHash) signatoryExist(documentHash, msg.sender) returns (bool) {
        documents[documentHash].signatures[msg.sender] = Signature({
            signatoryAddress: msg.sender,
            note: note,
            signedAt: block.timestamp
        });

        emit DocumentSigned(documentHash, msg.sender);

        return true;
    }

    /**As you’ll see, the compiler complains However, if you’ve been coding in Solidity for a while, you might notice that the following works perfectly well:about both functions, getBryn and getPerson:

    * Get signatories added to the document.
    *
    * returns Signatory[]
    */
//    function getSignatories(string calldata documentHash) external view documentExist(documentHash) returns (Signatory [] memory) {
//        return documents[documentHash].signatories;
//    }

    /**
    * Get document signatures.
    *
    * returns Signature[]
    */
//    function getSignatures(string calldata documentHash) external view documentExist(documentHash) returns (Signature [] memory) {
//        uint256 totalSignatories = documents[documentHash].signatories.length;
//        Signature [] memory signatures = new Signature[](totalSignatories);
//        for (uint i = 0; i < totalSignatories; i++) {
//            signatures[i] = documents[documentHash].signatures[
//                documents[documentHash].signatories[i].signatoryAddress
//            ];
//        }
//
//        return signatures;
//    }
}
