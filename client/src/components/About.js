import React, { Component } from "react";

export class About extends Component {
    state = {};

    render() {
        return (
            <div className="d-flex justify-content-center align-content-center align-items-center flex-column">
                <div className="about-page">
                    <h2>Introduction</h2>
                    <p>
                        Welcome to the blockchain document signer!
                        This is decentralized application running on the Ethereum blockchain.
                        This application is proof of concept which is a part of the Consensys Blockchain bootcamp.
                    </p>
                    <p>
                        The purpose of this application is to enable multiple parties to add, sign and verify their documents
                        on a blockchain without using third party services or centralized authorities as a source of trust.
                    </p>
                    <p>Use navigation in order to access different parts of application functionality.</p>
                    <p>
                        In order to start using the application you should connect your MetaMask wallet first!
                        You can connect it immediately while opening this web application or by clicking on the green
                        CONNECT button.
                    </p>

                    <h2>Adding documents</h2>
                    <p>
                        To add document you will need to generate its hash by using some of the methods mentioned on
                        the page for adding documents.
                    </p>
                    <p>
                        Document hash input is the main attribute that should be filled as it holds the integrity of
                        your document and make it possible to identify and verify on a blockchain.
                    </p>
                    <p>
                        Document name is the attribute that is arbitrary name used for easier understanding of which
                        document it's all about. It will help in easier identification and history auditing of your
                        documents.
                    </p>
                    <p>
                        Document description is also arbitrary string that will describe your document.
                        It serves the similar purpose as the document name.
                    </p>
                    <p>
                        Algorithm used can be selected from the combobox list and it's purpose is to help with auditing
                        and verifying documents. It will help you remember which algorithm you should use when you want
                        to verify your document integrity if you only have hash of it. By running document hashing
                        process again, you will be able to determine if it's the same one like on the blockchain.
                    </p>
                    <p>
                        Once document is added, you will be able to use it within the rest of three available features
                        (manage, sign and get its information).
                    </p>

                    <h2>Managing documents</h2>
                    <p>
                        This feature is used for adding signatories to the document. When you add signatory to your
                        document, they will be able to sign it.
                    </p>
                    <p>Only document owner can add (allow) signatory to sign specific document.</p>
                    <p>
                        When adding a signatory you can specify the amount of ETH you want to pay to the signatory
                        when they sign the proposed document.
                    </p>

                    <h2>Signing documents</h2>
                    <p>
                        If you are allowed to sign the specific document you can use this page to do so.
                        Just enter the document hash and click Sign button.
                    </p>
                    <p>
                        If a document owner provided some ETH for your signature, you'll receive it immediately after
                        you sign.
                    </p>
                    <p>Once signed, documents cannot be signed again.</p>

                    <h2>Getting document information</h2>
                    <p>
                        On this page you can enter the document hash and click on the available button in order to get
                        information about the document.
                    </p>
                    <p>
                        If a document contains signatories and signatures, they will appear on the screen.
                        If not, these information will be omitted.
                    </p>
                </div>
            </div>
        );
    }
}
