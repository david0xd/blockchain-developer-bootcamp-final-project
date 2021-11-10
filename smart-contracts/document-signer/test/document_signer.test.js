let DocumentSigner = artifacts.require("DocumentSigner")

contract("DocumentSigner", function (accounts) {
    const [_owner, alice, bob] = accounts
    const emptyAddress = "0x0000000000000000000000000000000000000000"

    const document = {
        documentHash: 'e8a12f6c1b134206cc8c0eccef8b5d114cf9ee3e8d835736564f8dc377d18d23',
        name: 'Document One',
        description: 'Just a test document...'
    }

    const signatory = {
        fullName: 'Bob',
        description: 'Real estate owner',
        signatoryAddress: bob
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
                    signatory.signatoryAddress,
                    signatory.fullName,
                    signatory.description,
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
                    signatory.signatoryAddress,
                    signatory.fullName,
                    signatory.description,
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
