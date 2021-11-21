import React, { Component } from "react";
import DocumentSignerContract from "./contracts/DocumentSigner.json";
import { getWeb3, getWeb3Directly } from "./getWeb3";

import "./App.css";
import { Button, Container, Nav } from "react-bootstrap";
import { DocumentSignerService } from "./util/DocumentSignerService";
import { AddDocumentByHash } from "./components/AddDocumentByHash";
import { ManageDocument } from "./components/ManageDocument";
import { SignDocument } from "./components/SignDocument";
import { GetDocument } from "./components/GetDocument";
import { About } from "./components/About";

const contractAddress = '0xb305B37aA206f234012fd7587F9Af83E907a25e0';

class App extends Component {
  pages = null;
  state = {
    web3: null,
    accounts: null,
    contract: null,
    documentSignerService: null,
    currentPage: 'addDocument'
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleNavChange = this.handleNavChange.bind(this);
    this.pages = {
      addDocument: React.createRef(),
      manageDocument: React.createRef(),
      signDocument: React.createRef(),
      getDocument: React.createRef(),
      about: React.createRef()
    }
  }

  componentDidMount = async () => {
    await this.connect();
  };

  async connect(connectingWithButton) {
    console.log('Connecting...');
    try {
      // Get network provider and web3 instance.
      let web3;
      if (connectingWithButton) {
        web3 = await getWeb3Directly();
      } else {
        web3 = await getWeb3();
      }

      // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = DocumentSignerContract.networks[networkId];
      const instance = new web3.eth.Contract(DocumentSignerContract.abi, contractAddress);
      instance.options.address = contractAddress;

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Instantiate document signer service
      const documentSignerService = new DocumentSignerService(web3, instance, accounts);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, contract: instance, accounts, documentSignerService });

      // detect Metamask account change
      window.ethereum.on('accountsChanged', async (accounts) => {
        await this.state.documentSignerService.accountChanged();
        this.setState({ accounts });
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  async connectWithButton() {
    await this.connect(true);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleNavChange(e) {
    this.pages.addDocument.current.className = 'nav-link';
    this.pages.manageDocument.current.className = 'nav-link';
    this.pages.signDocument.current.className = 'nav-link';
    this.pages.getDocument.current.className = 'nav-link';
    this.pages.about.current.className = 'nav-link';
    e.target.className = 'nav-link nav-active';
    this.setState({ currentPage: e.target.name });
  }

  isConnected() {
    return !!(this.state.accounts && this.state.accounts.length > 0);
  }

  render() {
    if (!this.isConnected()) {
      return (
          <div className="App">
            <Container fluid>
              <div className="d-flex justify-content-center align-content-center align-items-center flex-column pb-4">
                <h2 className="mb-2 mt-4">To begin, connect your wallet!</h2>
                <Button variant="success"
                        size="lg"
                        type="button"
                        className="mt-3"
                        onClick={ this.connectWithButton.bind(this) }>
                  Connect
                </Button>
              </div>
            </Container>
          </div>
      );
    }
    return (
      <div className="App">
        <Container fluid>
          <img src="logo.png" alt="Logo" className="logo mt-4 mb-2" />
          {this.state.accounts && this.state.accounts.length > 0 ?
            <p className="mt-2 mb-2">Connected with account: <b>{ this.state.accounts[0] }</b> </p> : null
          }
          <Nav className="justify-content-center mt-3 mb-3 text-light">
            <Nav.Item>
              <Nav.Link onClick={this.handleNavChange} ref={this.pages.addDocument} name="addDocument" className="nav-active">
                Add Document
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={this.handleNavChange} ref={this.pages.manageDocument} name="manageDocument">
                Manage Document
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={this.handleNavChange} ref={this.pages.signDocument} name="signDocument">
                Sign Document
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={this.handleNavChange} ref={this.pages.getDocument} name="getDocument">
                Document Information
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={this.handleNavChange} ref={this.pages.about} name="about">
                About
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="d-flex justify-content-center align-content-center align-items-center flex-column pb-4">
            {this.state.currentPage === 'addDocument' ?
              <AddDocumentByHash data={{documentSignerService: this.state.documentSignerService}}/> : null
            }
            {this.state.currentPage === 'manageDocument' ?
                <ManageDocument data={{documentSignerService: this.state.documentSignerService}}/> : null
            }
            {this.state.currentPage === 'signDocument' ?
                <SignDocument data={{documentSignerService: this.state.documentSignerService}}/> : null
            }
            {this.state.currentPage === 'getDocument' ?
                <GetDocument data={{documentSignerService: this.state.documentSignerService}}/> : null
            }
            {this.state.currentPage === 'about' ?
                <About data={{documentSignerService: this.state.documentSignerService}}/> : null
            }
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
