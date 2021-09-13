# Consensys Blockchain Bootcamp 2021 - Final Project

*This project is about signing a document and verifying its signatures on a blockchain.*

## Problem description
There are many things in this world relying on contracts. The modern world is driven by the contract agreements between people, countries, institutions, etc.

Contracts are usually represented by the document specifying the rules which parties need to respect. Contracts are usually valid only when signed by the involved parties.

Most of today contracts are still kept in form of papers while some are in digital format.
To sign a contract, parties usually need to write their name signature on a paper or to sign it using biometric identity cards or similar.

Some of the vulnerabilities of the given approaches can be answered by the following questions:
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
* User add and lock their personal identity information later used for signing.
* User send and allow another party to review, verify and approve the personal identity information provided by the user.
* User can verify the hash of the personal information attached to the signature in order to trust the party's signing activity.

## Identified entities:
 - Document (hash, timestamp, added by related information, description, name)
 - Signature (firstname, lastname, city, country, personal citizen number, identity card number)

