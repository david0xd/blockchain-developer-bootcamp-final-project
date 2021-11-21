import React, { Component } from "react";
import { Alert, Button, Form } from "react-bootstrap";

export class ManageDocument extends Component {
    state = {
        documentHash: '',
        signatoryAddress: '',
        signatoryName: '',
        signatoryDescription: '',
        amountToBePaid: '',
        documentActionSuccessful: false,
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

    addSignatory = async (e) => {
        e.preventDefault();
        this.setState({
            showError: false
        })

        try {
            await this.documentSignerService.addSignatory(
                this.state.documentHash,
                this.state.signatoryAddress,
                this.state.signatoryName,
                this.state.signatoryDescription,
                this.state.amountToBePaid
            );
            this.setState({
                signatoryAddress: '',
                signatoryName: '',
                signatoryDescription: '',
                documentActionSuccessful: true
            })

            setInterval(() => {
                this.setState({
                    documentActionSuccessful: false
                })
            }, 3000)
        } catch (error) {
            console.log(error);
            const errorMessage = error.message;
            this.setState({
                showError: true,
                errorMessage: errorMessage
            })
        }
    }

    render() {
        return (
            <div className="d-flex justify-content-center align-content-center align-items-center flex-column">
                {this.state.documentActionSuccessful === true ?
                    (<Alert variant={"success"}>
                        Document action executed successfully!
                    </Alert>) : null
                }
                {this.state.showError === true ?
                    (<Alert variant={"danger"}>
                        <h6>Error occurred while trying to perform action over document.</h6>
                        <p>{this.state.errorMessage}</p>
                    </Alert>) : null
                }
                <Form className="mt-2">
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
                    <Form.Group className="mb-3" controlId="formSignatoryAddress">
                        <Form.Label>Signatory address</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Paste signatory address here"
                                      name="signatoryAddress"
                                      value={this.state.signatoryAddress}
                                      onChange={this.handleChange}
                                      className="document-hash-input"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formSignatoryName">
                        <Form.Label>Signatory name</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter signatory full name"
                                      name="signatoryName"
                                      value={this.state.signatoryName}
                                      onChange={this.handleChange}
                                      className="document-hash-input"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formSignatoryDescription">
                        <Form.Label>Signatory description</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter signatory description or signing reason"
                                      name="signatoryDescription"
                                      value={this.state.signatoryDescription}
                                      onChange={this.handleChange}
                                      className="document-hash-input"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formSignatoryAmount">
                        <Form.Label>Amount to send</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter the amount of ETH to be sent to the contract."
                                      name="amountToBePaid"
                                      value={this.state.amountToBePaid}
                                      onChange={this.handleChange}
                                      className="document-hash-input"
                        />
                        <Form.Text className="text-custom-info">
                            Once signatory sign the document, the amount will be transferred to their account.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="success" type="button" onClick={this.addSignatory}>Add Signatory</Button>
                </Form>
            </div>
        );
    }
}
