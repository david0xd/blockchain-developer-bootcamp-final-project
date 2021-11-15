import React, { Component } from "react";
import {Alert, Button, Form, Table} from "react-bootstrap";

export class GetDocument extends Component {
    state = {
        documentHash: '',
        documentName: '',
        documentDescription: '',
        documentOwner: '',
        documentRetrieved: false,
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
        // TODO: Implement method to get document information
        const document = await this.documentSignerService.getDocument(this.state.documentHash);

        this.setState({
            documentName: document.name,
            documentDescription: document.description,
            documentOwner: document.owner,
            documentRetrieved: true
        })
        console.log(document);
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
                {this.state.documentRetrieved === true ?
                    (<Table striped bordered hover variant="dark" className="mt-4">
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
                        </tbody>
                    </Table>) : null
                }

            </div>
        );
    }
}
