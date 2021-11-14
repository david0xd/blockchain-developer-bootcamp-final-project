import React, { Component } from "react";
import DocumentSignerContract from "./contracts/DocumentSigner.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import {Alert, Button, Container, Form} from "react-bootstrap";

const contractAddress = '0x033A00c2a9f801818099d3bd87B8432055E5F499';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    documentHash: '',
    documentName: '',
    documentDescription: '',
    documentAdded: false,
    showError: false,
    errorMessage: '',
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = DocumentSignerContract.networks[networkId];
      const instance = new web3.eth.Contract(DocumentSignerContract.abi, contractAddress);
      instance.options.address = contractAddress;

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Add example document
    const documentHash = 'e8a12f6c1b134206cc8c0eccef8b5d114cf9ee3e8d835736564f8dc377d18d24'

    try {
      // const result = await contract.methods.addDocument(
      //     documentHash,
      //     'Document One',
      //     'This is the first document registered.'
      // ).send({ from: accounts[0] });
      // console.log(result);
    } catch (error) {
      console.log(error);
    }

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.documents(documentHash).call();

    // console.log(response);
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  addDocumentHash = async (e) => {
    e.preventDefault();
    const { contract, accounts, documentHash, documentName, documentDescription } = this.state;

    try {
      await contract.methods.addDocument(
          documentHash,
          documentName,
          documentDescription
      ).send({ from: accounts[0] });
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
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Container fluid>
          <div className="d-flex justify-content-center align-content-center align-items-center flex-column">
            {this.state.documentAdded === true ?
                (<Alert variant={"success"}>
                Document successfully added!
              </Alert>) : null
            }
            {this.state.showError === true ?
                (<Alert variant={"danger"}>
                  <h6>Error occurred while trying to add new document.</h6>
                  <p>{ this.state.errorMessage }</p>
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
                  <Form.Text className="text-muted">
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
                  <Form.Text className="text-muted">
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
                  <Form.Text className="text-muted">
                    Optionally, add description of your document.
                  </Form.Text>
                </Form.Group>
                <Button variant="success" type="submit">Add document hash</Button>
              </Form>
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
