import React from "react";
import Uploader from "./uploader";
import Logo from "./logo";
import ProfilePic from "./profilePic";
import axios from "./axios";

// still need to handle error messages...

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            email: "",
            profilePicUrl: "",
            activateUploadModal: false,
        };
        this.toggleUploadModal = this.toggleUploadModal.bind(this);
        this.setProfilePicUrl = this.setProfilePicUrl.bind(this);
    }

    componentDidMount() {
        // console.log("running a axios request...");
        axios
            .get("/user")
            .then((result) => {
                // console.log("received from /user:", result);
                this.setState({
                    first: result.data.first,
                    last: result.data.last,
                    profilePicUrl: result.data.url || "default_user.svg",
                });
            })
            .catch((err) => {
                console.log("received an error on /user:", err);
            });
    }

    toggleUploadModal() {
        this.setState({
            activateUploadModal: !this.state.activateUploadModal,
        });
    }

    setProfilePicUrl(url) {
        // console.log("Setting profile picture URL:", url);
        this.setState({
            profilePicUrl: url,
        });
        //
    }

    render() {
        return (
            <div className="app-frame">
                <Logo />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    profilePicUrl={this.state.profilePicUrl}
                    toggleUploadModal={this.toggleUploadModal}
                />
                {this.state.activateUploadModal && (
                    <Uploader setProfilePicUrl={this.setProfilePicUrl} />
                )}
            </div>
        );
    }
}
