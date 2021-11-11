let DocumentSigner = artifacts.require("DocumentSigner")

contract("DocumentSigner", function (accounts) {
    const [_owner, alice, bob, chris] = accounts
    const emptyAddress = "0x0000000000000000000000000000000000000000"

    const document = {
        documentHash: 'e8a12f6c1b134206cc8c0eccef8b5d114cf9ee3e8d835736564f8dc377d18d23',
        name: 'Document One',
        description: 'Just a test document...'
    }

    const signatoryBob = {
        fullName: 'Bob',
        description: 'Real estate purchaser',
        signatoryAddress: bob
    }

    const signatoryChris = {
        fullName: 'Chris',
        description: 'Real estate purchaser',
        signatoryAddress: chris
    }

    let instance;

    beforeEach(async () => {
        instance = await DocumentSigner.new()
    })

    describe("Variables", () => {
        it("should have a documents", async () => {
            assert.equal(typeof instance.documents, 'function', "the contract has no collection of documents");
        })
    })

    describe('Use cases', () => {
        describe('Document actions', () => {
            it('should add a document', async () => {
                await instance.addDocument(
                    document.documentHash,
                    document.name,
                    document.description,
                    { from: alice }
                )

                const result = await instance.documents(document.documentHash)

                assert.equal(
                    result[0],
                    document.documentHash,
                    "the hash of the last added document does not match the expected value",
                );

                assert.equal(
                    result[1],
                    document.name,
                    "the name of the last added document does not match the expected value",
                );

                assert.equal(
                    result[2],
                    document.description,
                    "the description of the last added document does not match the expected value",
                );

                assert.equal(
                    result[3],
                    alice,
                    "the owner of the last added document does not match the expected value",
                );
            })

            it('should add a signatory', async () => {
                await instance.addDocument(
                    document.documentHash,
                    document.name,
                    document.description,
                    { from: alice }
                )

                await instance.addSignatory(
                    document.documentHash,
                    signatoryBob.signatoryAddress,
                    signatoryBob.fullName,
                    signatoryBob.description,
                    { from: alice }
                )

                const result = await instance.getSignatories(document.documentHash)

                assert.equal(
                    result[0],
                    signatoryBob.signatoryAddress,
                    "the address of the first added signatory does not match the expected value",
                );
            })

            it('should sign a document', async () => {
                await instance.addDocument(
                    document.documentHash,
                    document.name,
                    document.description,
                    { from: alice }
                )

                await instance.addSignatory(
                    document.documentHash,
                    signatoryBob.signatoryAddress,
                    signatoryBob.fullName,
                    signatoryBob.description,
                    { from: alice }
                )

                await instance.signDocument(document.documentHash, { from: bob })

                const result = await instance.getSignatures(document.documentHash)

                assert.equal(
                    result[0],
                    bob,
                    "the signer address does not match the expected value",
                );
            })
        })

        describe('Getting information', () => {
            it('should retrieve all signatory addresses', async () => {
                await instance.addDocument(
                    document.documentHash,
                    document.name,
                    document.description,
                    { from: alice }
                )

                await instance.addSignatory(
                    document.documentHash,
                    signatoryBob.signatoryAddress,
                    signatoryBob.fullName,
                    signatoryBob.description,
                    { from: alice }
                )

                await instance.addSignatory(
                    document.documentHash,
                    signatoryChris.signatoryAddress,
                    signatoryChris.fullName,
                    signatoryChris.description,
                    { from: alice }
                )

                const result = await instance.getSignatories(document.documentHash)

                assert.equal(
                    result[0],
                    signatoryBob.signatoryAddress,
                    "the address of the first added signatory does not match the expected value",
                );

                assert.equal(
                    result[1],
                    signatoryChris.signatoryAddress,
                    "the address of the second added signatory does not match the expected value",
                );
            })

            it('should retrieve signatory information', async () => {
                await instance.addDocument(
                    document.documentHash,
                    document.name,
                    document.description,
                    { from: alice }
                )

                await instance.addSignatory(
                    document.documentHash,
                    signatoryBob.signatoryAddress,
                    signatoryBob.fullName,
                    signatoryBob.description,
                    { from: alice }
                )

                const result = await instance.getSignatoryInformation(document.documentHash, signatoryBob.signatoryAddress)

                assert.equal(
                    result[0],
                    signatoryBob.fullName,
                    "the full name of the signatory does not match the expected value",
                );

                assert.equal(
                    result[1],
                    signatoryBob.description,
                    "the description of the signatory does not match the expected value",
                );
            })

            it('should retrieve addresses of those who signed a document', async () => {
                await instance.addDocument(
                    document.documentHash,
                    document.name,
                    document.description,
                    { from: alice }
                )

                await instance.addSignatory(
                    document.documentHash,
                    signatoryBob.signatoryAddress,
                    signatoryBob.fullName,
                    signatoryBob.description,
                    { from: alice }
                )

                await instance.addSignatory(
                    document.documentHash,
                    signatoryChris.signatoryAddress,
                    signatoryChris.fullName,
                    signatoryChris.description,
                    { from: alice }
                )

                await instance.signDocument(document.documentHash, { from: bob })
                await instance.signDocument(document.documentHash, { from: chris })

                const result = await instance.getSignatures(document.documentHash)

                assert.equal(
                    result[0],
                    bob,
                    "the first signer address does not match the expected value",
                );

                assert.equal(
                    result[1],
                    chris,
                    "the second signer address does not match the expected value",
                );
            })
        })

        describe('Events', () => {
            it('should emit a DocumentAdded event when a document is added', async () => {
                let eventEmitted = false;
                const tx = await instance.addDocument(
                    document.documentHash,
                    document.name,
                    document.description,
                    { from: alice }
                )

                if (tx.logs[0].event === 'DocumentAdded') {
                    eventEmitted = true;
                }

                assert.equal(
                    eventEmitted,
                    true,
                    'adding a document should emit a DocumentAdded event',
                )
            })

            it('should emit a SignatoryAdded event when a signatory is added to a document', async () => {
                await instance.addDocument(
                    document.documentHash,
                    document.name,
                    document.description,
                    { from: alice }
                )
                let eventEmitted = false;
                const tx = await instance.addSignatory(
                    document.documentHash,
                    signatoryBob.signatoryAddress,
                    signatoryBob.fullName,
                    signatoryBob.description,
                    { from: alice }
                )

                if (tx.logs[0].event === 'SignatoryAdded') {
                    eventEmitted = true;
                }

                assert.equal(
                    eventEmitted,
                    true,
                    'adding a signatory should emit a SignatoryAdded event',
                )
            })

            it('should emit a DocumentSigned event when a document is signed', async () => {
                await instance.addDocument(
                    document.documentHash,
                    document.name,
                    document.description,
                    { from: alice }
                )
                let eventEmitted = false;
                await instance.addSignatory(
                    document.documentHash,
                    signatoryBob.signatoryAddress,
                    signatoryBob.fullName,
                    signatoryBob.description,
                    { from: alice }
                )

                let tx = await instance.signDocument(
                    document.documentHash,
                    { from: bob }
                )

                if (tx.logs[0].event === 'DocumentSigned') {
                    eventEmitted = true;
                }

                assert.equal(
                    eventEmitted,
                    true,
                    'signing a document should emit a DocumentSigned event',
                )
            })
        })

    })
})
