pragma solidity >=0.5.16 <0.9.0;

/// @title Document Signer Interface
/// @author David Drazic
/// @notice This interface specifies all external functions used for interaction with Document Signer smart contract
interface IDocumentSigner {
    /// @notice Add new document to the smart contract storage.
    /// @param documentHash Hash of a document to add
    /// @param name Name of a document
    /// @param description Arbitrary description of a document
    /// @param algorithm Algorithm that the document is hashed with
    /// @return bool (true) when document adding process has finished successfully
    function addDocument(
        string calldata documentHash,
        string calldata name,
        string calldata description,
        string calldata algorithm
    ) external returns (bool);

    /// @notice Add new user (signatory) to the smart contract and allow them to sign a specified document.
    /// @notice Only owner of a document can perform this action.
    /// @param documentHash Hash of a document to check
    /// @param signatoryAddress Address of a signatory to allow to sign specified document
    /// @param fullName Full name of a signatory that can be used to identify a person
    /// @param description Arbitrary description of a signatory or their role (i.e. director, employee, seller, etc.)
    /// @return bool (true) when operation is successfully completed
    function addSignatory(
        string calldata documentHash,
        address signatoryAddress,
        string calldata fullName,
        string calldata description
    ) external payable returns (bool);

    /// @notice Add signature to the document specified by a document hash.
    /// @notice If required, send the specified ETH amount to the signer.
    /// @param documentHash Hash of a document to sign
    /// @return bool (true) when operation is completed successfully
    function signDocument(string calldata documentHash) external returns (bool);

    /// @notice Get signatories added to the document.
    /// @param documentHash Hash of a document of which signatories are requested
    /// @return address [] Array of signatory addresses
    function getSignatories(string calldata documentHash) external view returns (address [] memory);

    /// @notice Get signatory information.
    /// @param documentHash Hash of a document related to the signatory
    /// @param signatoryAddress Address of a signatory of which info is requested
    /// @return string fullName,
    /// @return string description,
    /// @return uint256 signedAt,
    /// @return uint256 amountToBePaid,
    /// @return bool paid
    function getSignatoryInformation(
        string calldata documentHash,
        address signatoryAddress
    ) external view returns (string memory, string memory, uint256, uint256, bool);

    /// @notice Get document signatures in form of addresses of the signatories who signed the specified document
    /// @param documentHash Hash of a document of which to retrieve signatures
    /// @return address [] Array of addresses which signed a specified document
    function getSignatures(string calldata documentHash) external view returns (address [] memory);
}

/// @title Document Signer Smart Contract
/// @author David Drazic
/// @notice This smart contract is proof of concept for signing documents using hashes within blockchain
contract DocumentSigner is IDocumentSigner {

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
        uint256 amountToBePaid;
        bool paid;
    }

    /// @notice Documents mapped by hash
    mapping (string => Document) public documents;

    /// @notice Emitted when a document hash is successfully added
    /// @param documentHash Hash of a document that is added
    event DocumentAdded(string indexed documentHash);

    /// @notice Emitted when a signatory is successfully added to a document entity
    /// @param documentHash Hash od a document which added signatory can sign
    /// @param signatoryAddress Address of a signatory that is added
    event SignatoryAdded(string documentHash, address indexed signatoryAddress);

    /// @notice Emitted when a signatory successfully sign a document
    /// @param documentHash Hash of a document that is signed
    /// @param signatoryAddress Address of a signatory who signed a document
    event DocumentSigned(string documentHash, address indexed signatoryAddress);

    /// @notice Require that document does not exist
    /// @param documentHash Hash of a document to check
    modifier documentDoesNotExist(string memory documentHash) {
        require(documents[documentHash].owner == address(0), "Document has been already added.");
        _;
    }

    /// @notice Require that document exist.
    /// @param documentHash Hash of a document to check
    modifier documentExist(string memory documentHash) {
        require(documents[documentHash].owner != address(0), "Document does not exist.");
        _;
    }

    /// @notice Require that the signatory is added to a document
    /// @param documentHash Hash of a document to check
    /// @param signatoryAddress Address of a signatory
    modifier signatoryExist(string memory documentHash, address signatoryAddress) {
        require(
            documents[documentHash].addedSignatories[signatoryAddress] == true,
            "Signatory is now allowed to sign specified document."
        );
        _;
    }

    /// @notice Require that signatory does not exists within a document.
    /// @param documentHash Hash of a document to check
    /// @param signatoryAddress Address of a signatory
    modifier signatoryDoesNotExist(string memory documentHash, address signatoryAddress) {
        require(
            documents[documentHash].addedSignatories[signatoryAddress] == false,
            "Signatory is already added to a document. The requested operation can be executed only once."
        );
        _;
    }

    /// @notice Require that the signatory did not sign a specified document
    /// @param documentHash Hash of a document to check
    /// @param signatoryAddress Address of a signatory
    modifier signatoryDidNotSign(string memory documentHash, address signatoryAddress) {
        require(
            documents[documentHash].signatures[signatoryAddress] == false,
            "Signatory have already signed the specified document."
        );
        _;
    }

    /// @notice Require that call comes from document owner
    /// @param documentHash Hash of a document to check
    modifier onlyDocumentOwner(string memory documentHash) {
        require(
            documents[documentHash].owner == msg.sender,
            "Only owner is allowed to perform this kind of action over document.");
        _;
    }

    /// @notice Add new document to the smart contract storage.
    /// @param documentHash Hash of a document to add
    /// @param name Name of a document
    /// @param description Arbitrary description of a document
    /// @param algorithm Algorithm that the document is hashed with
    /// @return bool (true) when document adding process has finished successfully
    function addDocument(
        string calldata documentHash,
        string calldata name,
        string calldata description,
        string calldata algorithm
    ) external
    documentDoesNotExist(documentHash)
    returns (bool) {
        documents[documentHash].documentHash = documentHash;
        documents[documentHash].name = name;
        documents[documentHash].description = description;
        documents[documentHash].owner = msg.sender;
        documents[documentHash].algorithm = algorithm;
        documents[documentHash].createdAt = block.timestamp;

        emit DocumentAdded(documentHash);

        return true;
    }

    /// @notice Add new user (signatory) to the smart contract and allow them to sign a specified document.
    /// @notice Only owner of a document can perform this action.
    /// @param documentHash Hash of a document to check
    /// @param signatoryAddress Address of a signatory to allow to sign specified document
    /// @param fullName Full name of a signatory that can be used to identify a person
    /// @param description Arbitrary description of a signatory or their role (i.e. director, employee, seller, etc.)
    /// @return bool (true) when operation is successfully completed
    function addSignatory(
        string calldata documentHash,
        address signatoryAddress,
        string calldata fullName,
        string calldata description
    ) external payable
    documentExist(documentHash) onlyDocumentOwner(documentHash) signatoryDoesNotExist(documentHash, signatoryAddress)
    returns (bool) {
        documents[documentHash].signatories.push(
            Signatory({
                fullName: fullName,
                description: description,
                signatoryAddress: signatoryAddress,
                signedAt: 0,
                amountToBePaid: msg.value,
                paid: false
            })
        );
        documents[documentHash].addedSignatories[signatoryAddress] = true;
        emit SignatoryAdded(documentHash, signatoryAddress);

        return true;
    }

    /// @notice Add signature to the document specified by a document hash.
    /// @notice If required, send the specified ETH amount to the signer.
    /// @param documentHash Hash of a document to sign
    /// @return bool (true) when operation is completed successfully
    function signDocument(string calldata documentHash)
    external
    documentExist(documentHash)
    signatoryExist(documentHash, msg.sender)
    signatoryDidNotSign(documentHash, msg.sender)
    returns (bool) {
        // Mark document as signed
        documents[documentHash].signatures[msg.sender] = true;

        // Update signature timestamp & make payment if needed
        Signatory [] memory signatories = documents[documentHash].signatories;

        for (uint i = 0; i < signatories.length; i++) {
            if (signatories[i].signatoryAddress == msg.sender) {
                documents[documentHash].signatories[i].signedAt = block.timestamp;
                if (signatories[i].amountToBePaid > 0) {
                    documents[documentHash].signatories[i].amountToBePaid = 0;
                    documents[documentHash].signatories[i].paid = true;
                    msg.sender.transfer(signatories[i].amountToBePaid);
                }
            }
        }

        emit DocumentSigned(documentHash, msg.sender);

        return true;
    }

    /// @notice Get signatories added to the document.
    /// @param documentHash Hash of a document of which signatories are requested
    /// @return address [] Array of signatory addresses
    function getSignatories(string calldata documentHash)
    external view
    documentExist(documentHash)
    returns (address [] memory) {
        Signatory [] memory signatories = documents[documentHash].signatories;
        address [] memory addresses = new address [] (signatories.length);

        for (uint i = 0; i < signatories.length; i++) {
            Signatory memory signatory = signatories[i];
            addresses[i] = signatory.signatoryAddress;
        }

        return (addresses);
    }

    /// @notice Get signatory information.
    /// @param documentHash Hash of a document related to the signatory
    /// @param signatoryAddress Address of a signatory of which info is requested
    /// @return string fullName,
    /// @return string description,
    /// @return uint256 signedAt,
    /// @return uint256 amountToBePaid,
    /// @return bool paid
    function getSignatoryInformation(string calldata documentHash, address signatoryAddress)
    external view
    documentExist(documentHash) signatoryExist(documentHash, signatoryAddress)
    returns (string memory, string memory, uint256, uint256, bool) {
        Signatory [] memory signatories = documents[documentHash].signatories;
        Signatory memory targetSignatory;

        for (uint i = 0; i < signatories.length; i++) {
            Signatory memory signatory = signatories[i];
            if (signatory.signatoryAddress == signatoryAddress) {
                targetSignatory = signatory;
                break;
            }
        }

        return (
            targetSignatory.fullName,
            targetSignatory.description,
            targetSignatory.signedAt,
            targetSignatory.amountToBePaid,
            targetSignatory.paid
        );
    }

    /// @notice Get document signatures in form of addresses of the signatories who signed the specified document
    /// @param documentHash Hash of a document of which to retrieve signatures
    /// @return address [] Array of addresses which signed a specified document
    function getSignatures(string calldata documentHash)
    external view
    documentExist(documentHash)
    returns (address [] memory) {
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
