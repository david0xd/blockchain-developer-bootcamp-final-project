# Consensys Blockchain Bootcamp 2021 - Final Project
*This project is proof of concept for signing and verifying documents registered by hash on a blockchain.*

## Directory structure
Smart contracts are located under `smart-contracts` directory
The main contract is under `smart-contracts/document-signer` directory.
Frontend (client) application is located in `client` folder.

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

## Public ethereum account for NFT certification

## Deployed demo (frontend/client) application

## Screencast (walking through the project and use cases)

## Problem description
There are many things in this world relying on contracts. The modern world is driven by the contract agreements between people, countries, institutions, etc.

Contracts are usually represented by the document specifying the rules which parties need to respect. Contracts are usually valid only when signed by the involved parties.

Most of today contracts are still kept in form of papers while some are in digital format.
To sign a contract, parties usually need to write their name signature on a paper or to sign it using biometric identity cards or similar.

Some vulnerabilities of the given approaches can be answered by the following questions:
 - What if papers or documents are lost?
 - What if somebody's signature is counterfeit?
 - What if the certified (centralized) authority providing biometric identity cards is corrupted or compromised?
 - How anybody can guarantee and verify that the contracts are not changed on any side at any time?
 
Some of the most basic flaws of the current contract system:
 - Much of a physical resources are used.
 - Much of a time is wasted in the process.
 - Very common requirement of the parties to be on the same physical place in order to sign the documents.
 - Complex signing process rules.
 
## Solution proposal
Imagine the world in which blockchain approach for managing and signing documents (contracts) is well established and adopted. The whole set of problems mentioned above would likely disappear.

The blockchain approach proposes a creation of an application that will handle three  main use cases:
1. Hashing a document and storing documents hash on a blockchain.
2. Signing a document by parties and storing signature information.
3. Verifying document's hash at any time on a blockchain while having an overview of its signatures.

*Additionally blockchain approach can propose:*
 - *KYC-like (personal identity) mechanism for registering & approving trusted party on a blockchain in terms related to the smart contract established between the involved parties in decentralized way.*

## Use case description:
1. User is able to upload a document that is then hashed and added to blockchain.
2. User is able to upload the document or find it by hash and see its information then sign it.
3. User is able to upload the document and get information about the signatures (verification process).

More things to consider on the way:
* User can add and lock their personal identity information, later used for signing.
* User can send/share and allow another party to review, verify and approve the personal identity information provided by the user (party cooperation agreement).
* User can verify the hash of the personal information attached to the signature in order to trust the party's signing activity.
* Only allowed parties can have the personal information of another party.

## Identified entities:
 - Document (hash, timestamp, added by related information, description, name)
 - Signature (firstname, lastname, city, country, personal citizen number, identity card number)
 