# Design patterns used

## Access Control Design Patterns
- A kind of `Ownable` design pattern is used in two functions: `addSignatory()`, `signDocument()`.
- addSignatory function will ensure that only document owner can add a desired person and allow them to sign the document.
- signDocument function will ensure that only allowed (added to a document's signatory list) signatory is able to sign the specified document.
- signDocument function is capable of sending ether to the signer within the payable documents use case, so it ensures that only allowed signer who is signing a document can get the ETH specified and provided by the document owner initially.
- Conclusion statement:
    - addSignatory access control makes specific document resource ownable by the user who added it.
    - signDocument access control makes specific user own the right to sign the document.

## Inheritance and Interfaces
- `DocumentSigner` contract implements the `IDocumentSigner` interface with all its external functions.

## Optimizing Gas (Creating more efficient Solidity code)
- Document entities are stored using mapping instead of an array `mapping (string => Document) public documents;`. This allows cheaper data manipulation and avoids having issues with the operations running out of gas while using large arrays. 
- Signatories are held under the document structure to avoid having a large arrays of information `Signatory [] signatories;`. There is also a mapping of added signatories in order to make checks and operations faster `mapping (address => bool) addedSignatories;`.
- All the functions for contract interactions are made to be `external`. This is significantly reducing gas cost.
