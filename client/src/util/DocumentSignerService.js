/**
 * Use this service to wrap up web3 calls to the smart contract.
 * */
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
        return await this.contract.methods.addDocument(
            documentHash,
            documentName,
            documentDescription
        ).send({ from: this.accounts[0] });
    }

    async signDocument(documentHash) {
        return await this.contract.methods.signDocument(
            documentHash
        ).send({ from: this.accounts[0] });
    }

    async addSignatory(documentHash, address, fullName, description) {
        return await this.contract.methods.addSignatory(
            documentHash,
            address,
            fullName,
            description
        ).send({ from: this.accounts[0] });
    }

    async getDocument(documentHash) {
        return await this.contract.methods.documents(documentHash).call();
    }

    async getSignatories(documentHash) {
        return await this.contract.methods.getSignatories(documentHash).call();
    }

    async getSignatoryInformation(documentHash, signatoryAddress) {
        return await this.contract.methods.getSignatoryInformation(documentHash, signatoryAddress).call();
    }

    async getSignatures(documentHash) {
        return await this.contract.methods.getSignatures(documentHash).call();
    }

    async getAccountAddress() {
        const accountsUsed = await this.web3.eth.getAccounts();
        this.accounts = accountsUsed;
        return accountsUsed[0];
    }
}
