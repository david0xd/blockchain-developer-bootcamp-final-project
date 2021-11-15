import React, { Component } from "react";
import DocumentSignerContract from "./contracts/DocumentSigner.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import { Container } from "react-bootstrap";
import { DocumentSignerService } from "./util/DocumentSignerService";
import { AddDocumentByHash } from "./components/AddDocumentByHash";

const contractAddress = '0x033A00c2a9f801818099d3bd87B8432055E5F499';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    documentSignerService: null,
  };

  documentSignerService = null;

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

      // Instantiate document signer service
      const documentSignerService = new DocumentSignerService(web3, instance, accounts);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, documentSignerService });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Container fluid>
          <div className="d-flex justify-content-center align-content-center align-items-center flex-column">
            <AddDocumentByHash data={{documentSignerService: this.state.documentSignerService}}/>
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
