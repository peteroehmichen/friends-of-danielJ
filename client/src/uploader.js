import axios from "./axios";
import React from "react";
import { Spinner } from "./helpers";

// still need to block upload button when uploading

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
            loading: false,
        };
        this.selectHandler = this.selectHandler.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
    }

    selectHandler(e) {
        if (e.target.files[0].size > 2097152) {
            this.setState({
                file: "",
                filename: "max. 2 MB",
                error: "File Size too large",
            });
        } else {
            this.setState({
                file: e.target.files[0],
                filename: e.target.files[0].name,
                error: false,
            });
        }
    }

    async uploadPicture() {
        if (this.state.file) {
            this.setState({
                loading: true,
            });

            const profilePicture = new FormData();
            profilePicture.append("file", this.state.file);

            try {
                const response = await axios.post(
                    "/api/user/profile-pic.json",
                    profilePicture
                );
                if (!response.data.error) {
                    console.log("Upload Post received:", response);
                    this.setState({
                        loading: false,
                    });
                    this.props.setProfilePicUrl(response.data.url);
                } else {
                    // TODO set a rule for unsuccessful upload
                }
            } catch (err) {
                this.setState({
                    loading: false,
                });
                console.log("error in Upload Post:", err);
            }
        } else {
            console.log("no file selected!");
        }
    }

    render() {
        let button;
        if (this.state.loading) {
            button = (
                <button disabled={true}>
                    <Spinner />
                </button>
            );
        } else {
            button = (
                <button
                    onClick={() => {
                        this.uploadPicture();
                    }}
                >
                    Upload picture
                </button>
            );
        }

        return (
            <div className="overlay">
                <div className="uploader">
                    <h1
                        onClick={() => {
                            this.props.toggleUploadModal();
                        }}
                    >
                        X
                    </h1>
                    <h1>This is the upload functionality</h1>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        accept="image/*"
                        onChange={this.selectHandler}
                        key={4}
                    />
                    <label htmlFor="file">
                        <img src="/upload_white.svg" />
                        <span>{this.state.filename}</span>
                    </label>
                    {button}
                </div>
            </div>
        );
    }
}

/* 
select picture
formdata
and axios
must be able to update the profilepicURL of App

x to close the modal
Funny bonus would be to draw your own picture
*/
