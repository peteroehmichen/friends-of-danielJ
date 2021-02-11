import axios from "./axios";
import Spinner from "./spinner";
import React from "react";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeEditor: false,
            bio: "",
            error: "",
            loading: false,
        };
        this.toggleEditor = this.toggleEditor.bind(this);
        this.saveBio = this.saveBio.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            bio: this.props.bio,
        });
    }

    handleChange(e) {
        this.setState({
            bio: e.target.value,
        });
        // console.log("state in BioEditor:", this.state);
    }

    toggleEditor() {
        // console.log("Toggling...");
        this.setState({
            activeEditor: !this.state.activeEditor,
        });
    }

    saveBio() {
        // console.log("could send:", this.state.bio);
        this.setState({
            loading: true,
        });
        axios
            .post("/profile-bio", { bio: this.state.bio })
            .then((result) => {
                // console.log("we received from BIO POST:", result);
                this.setState({ loading: false });
                if (result.data.update) {
                    this.props.setBio(this.state.bio);
                    this.toggleEditor();
                } else {
                    this.setState({
                        error: result.data.error,
                    });
                }
            })
            .catch((err) => {
                console.log("there was an error in sending BIO:", err);
                this.setState({
                    loading: false,
                    error: "Error in Connecting to Server",
                });
            });
    }

    render() {
        const buttonText = this.props.bio ? "edit Bio" : "add Bio";
        const off = (
            <div>
                <p>{this.props.bio}</p>
                <button onClick={this.toggleEditor}>{buttonText}</button>
            </div>
        );

        const waitButton = this.state.loading ? (
            <button disabled={true}>
                <Spinner />
            </button>
        ) : (
            <button onClick={this.saveBio}>Save Bio</button>
        );
        let on = (
            <div>
                <textarea
                    defaultValue={this.props.bio}
                    onChange={this.handleChange}
                />
                {waitButton}
                <div className="error">
                    {this.state.error && <p>{this.state.error}</p>}
                </div>
            </div>
        );
        return (
            <div className="bio">{(this.state.activeEditor && on) || off}</div>
        );
    }
}
