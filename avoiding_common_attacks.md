# Contract security measures

## SWC-103 (Floating pragma)
Specific compiler pragma `pragma solidity 0.5.16;` is used in contracts to avoid accidental bug inclusion through outdated compiler versions.

## SWC-105 (Unprotected Ether Withdrawal)
The DocumentSigner as a part of payable documents feature implements access controls so withdrawals can only be triggered by allowed parties.

Function `signDocument(string calldata documentHash)` is used for signing a document. This function will perform signatory related checks
such as `signatoryExist(documentHash, msg.sender)` and `signatoryDidNotSign(documentHash, msg.sender)` which will ensure that only allowed 
signatory which have not yet signed the specified document can sign it and withdraw the funds (if specified) from the smart contract.

Function `signDocument(string calldata documentHash)` will always check if there is an amount of ether specified and greater than 
zero `if (signatories[i].amountToBePaid > 0)`and the withdrawal amount will be predefined and read from the 
`amountToBePaid` storage variable within the signatory structure so the signatory does not have any influence on the 
value they're withdrawing. The `amountToBePaid` is something that only can be modified by the document owner who sent 
that ether amount to the smart contract while adding the signatory.

## SWC-107 (Reentrancy / Checks-Effects-Interactions)
DocumentSigner smart contract inside withdrawal-able function `signDocument(string calldata documentHash)` makes sure 
that all internal state changes are performed before the call is executed.
1. Modifier runs first `signatoryDidNotSign(documentHash, msg.sender)`
2. Document is marked as signed `documents[documentHash].signatures[msg.sender] = true;`
3. Amount to be paid is checked next `if (signatories[i].amountToBePaid > 0)`
4. Amount to be paid is set to zero `documents[documentHash].signatories[i].amountToBePaid = 0;`
5. Transfer is executed at the end `msg.sender.transfer(signatories[i].amountToBePaid);`

## Modifiers used only for validation
All modifiers in contract(s) only validate data with `require` statements.

## Pull over push
All functions that modify state are based on receiving calls rather than making contract calls.
