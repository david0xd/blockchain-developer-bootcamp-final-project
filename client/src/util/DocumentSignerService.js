
export class DocumentSignerService {

    web3 = null;
    contract = null;
    accounts = [];

    constructor(web3, contract, accounts) {
        this.web3 = web3;
        this.contract = contract;
        this.accounts = accounts;
    }

    async addDocument(documentHash, documentName, documentDescription) {
        await this.contract.methods.addDocument(
            documentHash,
            documentName,
            documentDescription
        ).send({ from: this.accounts[0] });
    }
}
