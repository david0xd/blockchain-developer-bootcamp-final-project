# Consensys Blockchain Bootcamp 2021 - Final Project
*This project is proof of concept for signing and verifying documents registered by hash on a blockchain.*

## Directory structure
Smart contracts are located under `smart-contracts` directory
The main contract is under `smart-contracts/document-signer` directory.
Frontend (client) application is located in `client` directory.
File hashing tool is located under `hash-tool` directory.

## Running on localhost
In order to run fullstack application (client frontend + blockchain) the following tools needs to be installed first:
1. NodeJS, NPM, Yarn
2. Git
3. [Truffle](https://trufflesuite.com/truffle)
4. [Ganache](https://trufflesuite.com/ganache)

### Starting blockchain
1. Run Ganache and import this project's directory called `document-signer`, located under `smart-contracts`. 
   - Make sure to configure Ganache to run on port `8545` so your RPC looks like this `HTTP://127.0.0.1:8545`.
2. Once Ganache is running, start truffle console with the following command: `truffle console --network console`.
   - This will attach your truffle console to the blockchain running withing Ganache.
   - Note: In this way you can run client frontend with connecting metamask to default localhost, and you'll also be able to run the unit tests with the default configuration, all at the same time.
3. Inside the console type `migrate`. This will migrate Document signer contract to the network that Ganache is running, so you can observe the status inside Ganache.
   - Note: You can access and use DocumentSigner contract inside the console by getting it with `let docSign = await DocumentSigner.deployed()`. 

### Starting client (frontend) application
1. Open new terminal and position inside `/client` folder.
2. Run `yarn` as a command which will install all the required dependencies.
3. Configure address of your freshly deployed smart contract inside `App.js` file right below the imports, defined as something like `const contractAddress = '0xb305B37aA206f234012fd7587F9Af83E907a25e0';`.
   - Note: You can always get smart contract address from the Ganache UI.
4. Run `yarn start` in order to start the frontend application in development mode on [http://localhost:3000](http://localhost:3000)
   - Note: For more information about the managing client app and its builds consult README.md file located under the `/client/` directory.

## Running unit tests for smart contract
_Truffle installation is prerequisite for running unit tests._
To run unit test position into `smart-contracts/document-signer` directory.
Then run `truffle test`.
Tests will run automatically with the default truffle configurations.
Total of 18 unit tests should pass.

## Generating document hash in local environment
1. Change directory to `hash-tool` withing this project.
2. Run `npm install` command and wait to complete.
3. Use the following command to generate document hash: `node index.js your_file_name hashing_algorithm`
   - Example one: `node index.js TestDocument1.pdf sha256`
   - Example two: `node index.js TestDocument2.pdf sha512`
   - Notice that there are two example document that can be used for testing (`TestDocument1.pdf` and `TestDocument2.pdf`).

Hashing output should look like this:
```
$ node index.js TestDocument1.pdf sha256
Hash successfully calculated!
Algorithm used: sha256
Document hash:
61d1250700e55c909255a61e8fb13b5cf148b2f6ba18cb9b190766376d53dc15
```

## Public ethereum account for NFT certification

## Deployed demo (frontend/client) application
[https://david0xd.github.io/](https://david0xd.github.io/)

_Note: Frontend (client web3) application is tested only in Google Chrome with MetaMask. 
There is no guarantee that it will work properly in other browsers and wallets at the moment._

## Screencast (walking through the project and use cases)

## Project description

### Problem description and motivation
There are many things in this world relying on contracts. 
The modern world is driven by the contract agreements between people, companies, countries, institutions, etc.

Contracts are usually represented by the document specifying the rules which parties need to respect. 
Contracts are usually valid only when signed by the involved parties.

Most of today contracts are still kept in form of papers while some are in digital format.
To sign a contract, parties usually need to write their name signature on a paper or to sign it using biometric 
identity cards or similar.

Some vulnerabilities of the given approaches can be answered by the following questions:
 - What if signed papers or documents are lost?
 - What if somebody's signature is counterfeit?
 - What if the certified (centralized) authority providing biometric identity cards is corrupted or compromised?
 - How anybody can guarantee and verify that the contracts are not changed on any side at any time?
 
Some of the most basic flaws of the current contract system:
 - Much of a physical resources are used.
 - Much of a time is wasted in the process.
 - Very common requirement of the parties to be on the same physical place in order to sign the documents.
 - Complex signing process rules.
 
## Solution proposal
Imagine the world in which blockchain approach for managing and signing documents (contracts) is well established and adopted. 
The whole set of problems mentioned above would likely disappear.

The blockchain approach proposes a creation of an application that will handle three  main use cases:
1. Hashing a document and storing document's hash inside smart contract deployed on a blockchain.
2. Adding the signatories as the parties that are allowed to sign a document within some of their information.
   - This is extended by a "payable documents" feature which allows document owner to send some value for each signatory that will be paid to the signatory after signing.
3. Signing a document by parties and storing signature information.
   - This is also extended by a "payable documents" feature and in this part signatory will receive the amount of tokens specified by the document owner.
4. Verifying document's hash at any time on a blockchain while having an overview of its signatories and signatures.

## Use case description:
1. User is able to add a document hash to the blockchain smart contract.
2. User which is a document owner is able to add another persons as the signatories and allow them to sign his documents.
3. User is able to send some ETH as the value when adding each signatory. Each signatory is paid the exact amount that document owner specified.
4. User is able to enter the document hash and see the document information alongside with the signatories, amounts to be paid, signatures and timestamps when actions occurred.
5. User is able to sign the document that they're allowed to. If specified, a signatory user will receive the amount of ETH left for them when they sign the document.

## Identified entities:
 - Document structure: 
   - documentHash - _string_ Hash of a document
   - name - _string_ Name of a document
   - description - _string_ Description of a document and its purpose
   - owner - _address_ Address of a document owner
   - signatories - _Signatory[]_ Array of signatories allowed to sign the document.
   - addedSignatories - _mapping_ Mapping of which addresses of signatories are allowed to sign the document.
   - signatures - _mapping_ Mapping of which address have signed the document
   - algorithm - _string_ Algorithm that is used for a document hashing
   - createdAt - _uint256_ Timestamp (block.timestamp)
 - Signatory structure: 
   - fullName - _string_ Full name of a signatory person
   - description - _string_ Description of a signatory role, reason for signing, etc.
   - signatoryAddress - _address_ Address of a signatory
   - signedAt - _uint256_ Unix timestamp when signatory signed the document
   - amountToBePaid - _uint256_ Amount of ETH in wei that will be paid to the signatory when they sign a document
   - paid - _bool_ Boolean value which represent if the amount is paid to the signatory (default: false)
   
## Creator's notes (_good to read as it explains more about the concept_)
This application is imagined and designed to work without any third party off-chain services or resources.
Hence, it provides a little more possibility for storing data on chain.

Despite that the usage of the gas is a little higher, it should justify itself by removing third party off-chain 
solutions and enabling overview of the history and purpose of the documents and their signatures that are immutable 
and stored on the blockchain forever as the single source of truth.

In order to make this future-proof this application can be developed as L2 solution. 
In that case only the most important data would be saved on the main blockchain such as document hash, owner and 
signatory addresses, etc. That approach would be able to significantly reduce the cost of gas.

## Possible future improvements
- KYC-like (personal identity) mechanism for registering & approving trusted party on a blockchain in terms related to 
the smart contract established between the involved parties in decentralized way. 
Some kind of handshake mechanism between the owner and signatory.
- Possibility for the document owners to remove signatory before they sign the document and withdraw the ETH they've sent.
- Making an optimized Smart Contracts using Layer 2 (L2) solutions. This would propose of keeping the additional data 
on the L2, while having only the main data such as document hashes and signatures on the main (ethereum) blockchain.
- Allowing document to be stored using IPFS and linking them to the smart contract.
