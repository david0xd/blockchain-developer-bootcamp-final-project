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

    async addDocument(documentHash, documentName, documentDescription, documentHashingAlgorithm) {
        return await this.contract.methods.addDocument(
            documentHash,
            documentName,
            documentDescription,
            documentHashingAlgorithm
        ).send({ from: this.accounts[0] });
    }

    async signDocument(documentHash) {
        return await this.contract.methods.signDocument(
            documentHash
        ).send({ from: this.accounts[0] });
    }

    async addSignatory(documentHash, address, fullName, description, amountToBePaidInETH) {
        // Handle amount to be paid
        const amountToBePaidInWei = this.web3.utils.toWei(amountToBePaidInETH.toString(), 'ether');
        console.log(amountToBePaidInWei);

        return await this.contract.methods.addSignatory(
            documentHash,
            address,
            fullName,
            description
        ).send({ from: this.accounts[0], value: amountToBePaidInWei });
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

    async accountChanged() {
        const accountsUsed = await this.web3.eth.getAccounts();
        this.accounts = accountsUsed;
        return accountsUsed[0];
    }

    pollTransaction = ({ interval, maxAttempts, transactionHash }) => {
        console.log('Start transaction polling...');
        let attempts = 0;

        const waitForTransactionToComplete = async (resolve, reject) => {
            console.log('- transaction poll');
            const result = await this.web3.eth.getTransactionReceipt(transactionHash)
            attempts++;

            if (result !== null) {
                return resolve(result);
            } else if (maxAttempts && attempts === maxAttempts) {
                return reject(new Error('Exceeded max number of attempts for transaction polling'));
            } else {
                setTimeout(waitForTransactionToComplete, interval, resolve, reject);
            }
        };

        return new Promise(waitForTransactionToComplete);
    };
}
