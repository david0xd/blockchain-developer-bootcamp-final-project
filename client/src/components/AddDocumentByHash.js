import React, {Component} from "react";
import {Alert, Button, Form} from "react-bootstrap";

export class AddDocumentByHash extends Component {
    state = {
        documentHash: '',
        documentName: '',
        documentDescription: '',
        documentAdded: false,
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
        const {documentHash, documentName, documentDescription} = this.state;

        try {
            await this.documentSignerService.addDocument(
                documentHash,
                documentName,
                documentDescription
            );
            this.setState({
                documentAdded: true,
                documentHash: '',
                documentName: '',
                documentDescription: '',
            })
            setInterval(() => {
                this.setState({
                    documentAdded: false
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
                {this.state.documentAdded === true ?
                    (<Alert variant={"success"}>
                        Document successfully added!
                    </Alert>) : null
                }
                {this.state.showError === true ?
                    (<Alert variant={"danger"}>
                        <h6>Error occurred while trying to add new document.</h6>
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
                            Use SHA256 algorithm to hash your documents!
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
                    <Button variant="success" type="submit">Add document hash</Button>
                </Form>
            </div>
        );
    }
}