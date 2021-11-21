import React, { Component } from "react";
import { Alert, Button, Form, Table } from "react-bootstrap";

export class GetDocument extends Component {
    state = {
        documentHash: '',
        documentName: '',
        documentDescription: '',
        documentOwner: '',
        documentHashingAlgorithm: '',
        documentTimestamp: '',
        documentSignatories: [],
        documentSignatures: [],
        documentRetrieved: false,
        signatoriesRetrieved: false,
        signaturesRetrieved: false,
        showError: false,
        errorMessage: '',
    };
    documentSignerService = null;

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.documentSignerService = props.data.documentSignerService;
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            documentRetrieved: false,
            signatoriesRetrieved: false,
            signaturesRetrieved: false,
            documentSignatories: [],
            documentSignatures: []
        });
    }

    getDocument = async (e) => {
        e.preventDefault();

        // Reset initial states
        this.setState({
            documentName: '',
            documentDescription: '',
            documentOwner: '',
            documentHashingAlgorithm: '',
            documentTimestamp: '',
            documentRetrieved: false,
            signatoriesRetrieved: false,
            documentSignatories: [],
            signaturesRetrieved: false,
            documentSignatures: []
        })

        const document = await this.documentSignerService.getDocument(this.state.documentHash);

        // Manage timestamp
        // const dateCreated = new Date(document.createdAt * 1000);
        // const time = dateCreated.getHours() + ':' + dateCreated.getMinutes();
        // const dateFormatted = dateCreated.toLocaleDateString("en-US") + ' - ' + time + 'h';
        const dateFormatted = this.getFormattedDateFromTimestamp(document.createdAt);

        this.setState({
            documentName: document.name,
            documentDescription: document.description,
            documentOwner: document.owner,
            documentHashingAlgorithm: document.algorithm,
            documentTimestamp: dateFormatted,
            documentRetrieved: true
        })

        const signatories = await this.documentSignerService.getSignatories(this.state.documentHash);
        const signatoriesWithInfo = [];
        for (let signatory of signatories) {
            const signatoryInfo = await this.documentSignerService
                .getSignatoryInformation(this.state.documentHash, signatory)
            const amountToBePaidInETH = this.documentSignerService.web3.utils.fromWei(signatoryInfo[3]);
            signatoriesWithInfo.push({
                address: signatory,
                name: signatoryInfo[0],
                description: signatoryInfo[1],
                signedAt: signatoryInfo[2],
                amountToBePaid: amountToBePaidInETH,
                paid: signatoryInfo[4],
            });
        }
        console.log(signatoriesWithInfo)

        this.setState({
            signatoriesRetrieved: true,
            documentSignatories: signatoriesWithInfo
        })

        const signatures = await this.documentSignerService.getSignatures(this.state.documentHash);
        this.setState({
            signaturesRetrieved: true,
            documentSignatures: signatures
        })
    }

    getFormattedDateFromTimestamp(timestamp) {
        const dateCreated = new Date(timestamp * 1000);
        const time = dateCreated.getHours() + ':' + dateCreated.getMinutes();
        return dateCreated.toLocaleDateString("en-US") + ' - ' + time + 'h';
    }

    showSignatories = () => {
        let indexKey = 0;

        return this.state.documentSignatories.map(s => {
            indexKey++;
            return (<tr key={ s + indexKey }>
                <td>{ s.name }</td>
                <td>{ s.description }</td>
                <td>{ s.address }</td>
                <td>{ s.amountToBePaid } ETH</td>
                <td>{ s.paid === true ? 'Yes' : 'No' }</td>
            </tr>)
        });
    }

    showSignatures = () => {
        let indexKey = 0;

        return this.state.documentSignatures.map(s => {
            if (s !== '0x0000000000000000000000000000000000000000') {
                indexKey++;
                const signatoryInfo = this.state.documentSignatories.find(signatory => signatory.address === s);

                return (<tr key={ s + indexKey }>
                    <td>{ signatoryInfo.name }</td>
                    <td>{ signatoryInfo.description }</td>
                    <td>{ s }</td>
                    <td>{ this.getFormattedDateFromTimestamp(signatoryInfo.signedAt) }</td>
                </tr>)
            } else {
                console.log('Show signatures: Skipping 0x0000000000000000000000000000000000000000 address.');
            }
        });
    }

    render() {
        return (
            <div className="d-flex justify-content-center align-content-center align-items-center flex-column">
                {this.state.showError === true ?
                    (<Alert variant={"danger"}>
                        <h6>Error occurred while trying to perform action over document.</h6>
                        <p>{this.state.errorMessage}</p>
                    </Alert>) : null
                }
                <Form className="mt-2" onSubmit={this.getDocument}>
                    <Form.Group className="mb-3" controlId="formDocumentHash">
                        <Form.Label>Document hash</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Paste your document hash here"
                                      name="documentHash"
                                      value={this.state.documentHash}
                                      onChange={this.handleChange}
                                      className="document-hash-input"
                        />
                    </Form.Group>
                    <Button variant="success" type="submit">Get document info</Button>
                </Form>
                {this.state.documentRetrieved ? (<h3 className="mt-4">Basic document information</h3>) : null }
                {this.state.documentRetrieved === true ?
                    (<Table striped bordered hover variant="dark" className="mt-2">
                        <tbody>
                        <tr>
                            <td className="dark-color"><b>Hash</b></td>
                            <td>{this.state.documentHash}</td>
                        </tr>
                        <tr>
                            <td className="dark-color"><b>Name</b></td>
                            <td>{this.state.documentName}</td>
                        </tr>
                        <tr>
                            <td className="dark-color"><b>Description</b></td>
                            <td>{this.state.documentDescription}</td>
                        </tr>
                        <tr>
                            <td className="dark-color"><b>Owner address</b></td>
                            <td>{this.state.documentOwner}</td>
                        </tr>
                        <tr>
                            <td className="dark-color"><b>Hashing algorithm</b></td>
                            <td>{this.state.documentHashingAlgorithm}</td>
                        </tr>
                        <tr>
                            <td className="dark-color"><b>Created at</b></td>
                            <td>{this.state.documentTimestamp}</td>
                        </tr>
                        </tbody>
                    </Table>) : null
                }
                {
                    this.state.documentSignatories && (this.state.documentSignatories.length > 0) ?
                        <h4 className="mt-2">Added signatories</h4>
                        : null
                }
                { this.state.signatoriesRetrieved && (this.state.documentSignatories.length > 0) ?
                    (<Table striped bordered hover variant="dark" className="mt-2">
                        <thead>
                        <tr>
                            <th>Signatory name</th>
                            <th>Signatory description</th>
                            <th>Signatory address</th>
                            <th>Amount to be paid</th>
                            <th>Paid</th>
                        </tr>
                        </thead>
                        <tbody>
                        { this.showSignatories() }
                        </tbody>
                    </Table>) : null
                }
                {
                    this.state.signaturesRetrieved && (this.state.documentSignatures.length > 0) ?
                        <h4 className="mt-2">Signatures</h4>
                        : null
                }
                { this.state.signaturesRetrieved && (this.state.documentSignatures.length > 0) ?
                        (<Table striped bordered hover variant="dark" className="mt-2">
                            <thead>
                                <tr>
                                    <th>Signatory name</th>
                                    <th>Signatory description</th>
                                    <th>Signatory address</th>
                                    <th>Signed at</th>
                                </tr>
                            </thead>
                            <tbody>
                            { this.showSignatures() }
                            </tbody>
                        </Table>) : null
                }

            </div>
        );
    }
}
