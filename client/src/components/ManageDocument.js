import React, { Component } from "react";
import { Alert } from "react-bootstrap";

export class ManageDocument extends Component {
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

    addSignatory = async (e) => {
        // TODO: Implement method to add signatory to the specified document
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
                <h2>Manage document here...</h2>
            </div>
        );
    }
}
