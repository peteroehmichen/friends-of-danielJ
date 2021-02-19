import axios from "./axios";
import React from "react";
import { Spinner } from "./helpers";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
            filename: "",
            loading: false,
            error: false,
        };
        this.selectHandler = this.selectHandler.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
    }

    selectHandler(e) {
        e.target.labels[0].style.borderBottom = "3px solid orangered";
        if (e.target.files.length < 1) {
            this.setState({
                file: "",
                filename: "",
                error: "",
            });
        } else if (e.target.files[0].size > 2097152) {
            this.setState({
                file: "",
                filename: "max. 2 MB",
                error: "File Size too large",
            });
        } else {
            let shortened = e.target.files[0].name;
            shortened =
                shortened.length > 18
                    ? shortened.slice(0, 18) + "..."
                    : shortened;
            this.setState({
                file: e.target.files[0],
                filename: shortened,
                error: "",
            });
            e.target.labels[0].style.borderBottom = "3px solid green";
        }
    }

    async uploadPicture() {
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
                this.setState({
                    loading: false,
                });
                this.props.setProfilePicUrl(response.data.url);
            } else {
                this.setState({
                    error: response.data.error,
                    loading: false,
                });
            }
        } catch (err) {
            this.setState({
                error: "unknown server error",
            });
            console.log("error in Upload Post:", err);
        }
    }

    render() {
        return (
            <div className="overlay">
                <div className="uploader">
                    <div
                        className="close"
                        onClick={() => {
                            this.props.toggleUploadModal();
                        }}
                    >
                        X
                    </div>
                    <h2>Upload your Profile Picture</h2>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        accept="image/*"
                        onChange={this.selectHandler}
                        key={4}
                    />
                    <label htmlFor="file">
                        <img src="/upload_black.svg" />
                        <span>
                            {this.state.filename || "Please select an image"}
                        </span>
                    </label>
                    <button
                        className={(this.state.error && "error-btn") || " "}
                        disabled={
                            !this.state.file ||
                            this.state.error ||
                            this.state.loading
                        }
                        onClick={() => this.uploadPicture()}
                    >
                        {this.state.error ? (
                            this.state.error
                        ) : this.state.loading ? (
                            <Spinner />
                        ) : (
                            "Upload Picture"
                        )}
                    </button>
                    <img className="upload-image" src="/On_the_rock.jpg" />
                </div>
            </div>
        );
    }
}
