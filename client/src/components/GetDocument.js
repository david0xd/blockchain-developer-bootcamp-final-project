import React, { Component } from "react";
import {Alert, Button, Form, Table} from "react-bootstrap";

export class GetDocument extends Component {
    state = {
        documentHash: '',
        documentName: '',
        documentDescription: '',
        documentOwner: '',
        documentSignatories: [],
        documentRetrieved: false,
        signatoriesRetrieved: false,
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
            documentRetrieved: false
        });
    }

    getDocument = async (e) => {
        e.preventDefault();
        const document = await this.documentSignerService.getDocument(this.state.documentHash);

        this.setState({
            documentName: document.name,
            documentDescription: document.description,
            documentOwner: document.owner,
            documentRetrieved: true
        })

        const signatories = await this.documentSignerService.getSignatories(this.state.documentHash);
        this.setState({
            signatoriesRetrieved: true,
            documentSignatories: signatories
        })
        console.log(signatories);
    }

    showSignatories = () => {
        let indexKey = 0;
        return this.state.documentSignatories.map(s => { indexKey++; return <p key={ s + indexKey }>{ s }</p> });
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
                            <td>Hash</td>
                            <td>{this.state.documentHash}</td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>{this.state.documentName}</td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>{this.state.documentDescription}</td>
                        </tr>
                        <tr>
                            <td>Owner address</td>
                            <td>{this.state.documentOwner}</td>
                        </tr>
                        <tr>
                            <td>Signatories</td>
                            <td>
                                {
                                    this.state.signatoriesRetrieved && (this.state.documentSignatories.length === 0) ?
                                    "No signatories" : this.showSignatories()
                                }
                                { this.state.signatoriesRetrieved === false ? "Loading signatories..." : null }
                            </td>
                        </tr>
                        </tbody>
                    </Table>) : null
                }

            </div>
        );
    }
}
