import React, { Component } from "react";
import { Alert, Button, Form } from "react-bootstrap";

export class AddDocumentByHash extends Component {
    state = {
        documentHash: '',
        documentName: '',
        documentDescription: '',
        documentHashingAlgorithm: 'SHA-256',
        documentAdded: false,
        lastTransactionHash: '',
        transactionInProgress: false,
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
        this.setState({[e.target.name]: e.target.value});
    }

    addDocumentHash = async (e) => {
        e.preventDefault();
        const {documentHash, documentName, documentDescription, documentHashingAlgorithm} = this.state;

        try {
            this.setState({
                transactionInProgress: true,
                showError: false,
                errorMessage: ''
            })

            const result = await this.documentSignerService.addDocument(
                documentHash,
                documentName,
                documentDescription,
                documentHashingAlgorithm
            );

            this.setState({
                documentAdded: true,
                documentHash: '',
                documentName: '',
                documentDescription: '',
                lastTransactionHash: result.transactionHash,
                transactionInProgress: false
            })
            setInterval(() => {
                this.setState({
                    documentAdded: false
                })
            }, 9000)
        } catch (error) {
            console.log(error);
            const errorMessage = error.message;
            this.setState({
                showError: true,
                errorMessage: errorMessage,
                transactionInProgress: false
            })
        }
    }

    render() {
        return (
            <div className="d-flex justify-content-center align-content-center align-items-center flex-column">
                <Alert variant={"info"}>
                    <p>
                        You can use some of the online tools to hash your document like&nbsp;
                        <a href="https://md5file.com/calculator" target="_blank" rel="noreferrer">this one</a> or&nbsp;
                        <a href="https://emn178.github.io/online-tools/keccak_256_checksum.html"
                           target="_blank"
                           rel="noreferrer"
                        >this one</a> or you can use&nbsp;
                        <a href="https://www.npmjs.com/package/hash-files"
                           target="_blank"
                           rel="noreferrer"
                        >NPM package</a>.
                    </p>
                </Alert>
                {this.state.transactionInProgress === true ?
                    (<Alert variant={"success"}>
                        You successfully initiated a transaction for adding document hash!<br />
                        Confirm the transaction in your wallet and wait to complete.
                    </Alert>) : null
                }
                {this.state.documentAdded === true ?
                    (<Alert variant={"success"}>
                        Transaction confirmed! Document hash successfully added.
                        <p>Transaction hash: { this.state.lastTransactionHash }</p>
                    </Alert>) : null
                }
                {this.state.showError === true ?
                    (<Alert variant={"danger"}>
                        <h6>Error occurred while trying to add new document hash.</h6>
                        <p>{this.state.errorMessage}</p>
                    </Alert>) : null
                }
                <Form className="mt-2" onSubmit={this.addDocumentHash}>
                    <Form.Group className="mb-3" controlId="formDocumentHash">
                        <Form.Label>Document hash</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Paste your document hash here"
                                      name="documentHash"
                                      value={this.state.documentHash}
                                      onChange={this.handleChange}
                        />
                        <Form.Text className="text-custom-info">
                            Advice: Use SHA256 algorithm to hash your documents!
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDocumentName">
                        <Form.Label>Document name</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Add name of your document here"
                                      name="documentName"
                                      value={this.state.documentName}
                                      onChange={this.handleChange}
                        />
                        <Form.Text className="text-custom-info">
                            Adding document name is recommended since it's stored on-chain and can
                            help you identify and manage your documents later.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDocumentDescription">
                        <Form.Label>Document name</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Add description of your document here"
                                      name="documentDescription"
                                      value={this.state.documentDescription}
                                      onChange={this.handleChange}
                        />
                        <Form.Text className="text-custom-info">
                            Optionally, add description of your document.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Algorithm used</Form.Label>
                        <Form.Select aria-label="Hashing algorithm selection"
                                     name="documentAlgorithm"
                                     value={this.state.documentHashingAlgorithm}
                                     onChange={this.handleChange}
                        >
                            <option value="SHA-256">SHA-256 (recommended)</option>
                            <option value="SHA-1">SHA-1</option>
                            <option value="SHA-384">SHA-384</option>
                            <option value="SHA-512">SHA-512</option>
                            <option value="MD5">MD5</option>
                            <option value="KECCAK-256">Keccak-256</option>
                            <option value="KECCAK-384">Keccak-384</option>
                            <option value="KECCAK-512">Keccak-512</option>
                        </Form.Select>
                        <Form.Text className="text-custom-info">
                            Choose the algorithm you file is hashed with to help it's later verification.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="success" type="submit" className="mt-2" disabled={!this.state.documentHash}>
                        Add document hash
                    </Button>
                </Form>
            </div>
        );
    }
}
