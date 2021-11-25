import React, { Component } from "react";
import {Alert, Button, Form} from "react-bootstrap";

export class SignDocument extends Component {
    state = {
        documentHash: '',
        documentName: '',
        documentDescription: '',
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

    signDocument = async (e) => {
        // Reset potential errors
        this.setState({
            showError: false,
            errorMessage: ''
        })

        // Get signatories to see if the user is allowed to sign the specified document
        let allowedToSign = false;
        try {
            const signatories = await this.documentSignerService.getSignatories(this.state.documentHash);
            const currentAccount = await this.documentSignerService.getAccountAddress();
            allowedToSign = signatories.includes(currentAccount);
        } catch (error) {
            const errorMessage = error.message;
            this.setState({
                showError: true,
                errorMessage: errorMessage
            })
        }

        if (allowedToSign) {
            try {
                await this.documentSignerService.signDocument(this.state.documentHash);

                this.setState({
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
        } else {
            const errorMessage = 'Your account is not in signatory list. You are not allowed to sign this document.';
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
                        Document signed successfully!
                    </Alert>) : null
                }
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
                    <Button variant="success"
                            type="button"
                            onClick={this.signDocument}
                            disabled={!this.state.documentHash}>
                        Sign Document
                    </Button>
                </Form>
            </div>
        );
    }
}
