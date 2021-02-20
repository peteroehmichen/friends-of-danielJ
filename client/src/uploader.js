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
            confirm: "",
        };
        this.selectHandler = this.selectHandler.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
        this.shiftPane = this.shiftPane.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
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

    shiftPane(evt) {
        evt.preventDefault();
        if (evt.clientY >= this.minY && evt.clientY <= this.maxY) {
            const newPosition = evt.clientY - this.minY;
            this.one.style.height = newPosition + "px";
            this.slider.style.top = newPosition + "px";
        }
    }

    startDrag(e) {
        e.preventDefault();
        // console.log("dragging:", e);
        // console.dir(container);
        this.container = document.querySelector(".uploader-body");
        this.one = document.querySelector(".one");
        this.slider = document.querySelector(".slider");
        this.minY = e.clientY - e.target.offsetTop;
        this.maxY = this.minY + this.container.offsetHeight;
        // const start = e.clientY;
        document.addEventListener("mousemove", this.shiftPane);
    }

    stopDrag(evt) {
        document.removeEventListener("mousemove", this.shiftPane);
    }

    deleteAccount(e) {
        e.preventDefault(); // console.log("schade!", e);
        if (e.target.innerHTML == "are you SURE?") {
            console.log("going to delete USER");
            location.replace("/logout");
        } else {
            this.setState({
                loading: true,
                confirm: "please wait...",
            });
            setTimeout(() => {
                this.setState({
                    loading: false,
                    confirm: "are you SURE?",
                });
            }, 3000);
        }
    }

    render() {
        return (
            <div className="overlay">
                <div className="uploader">
                    <div className="uploader-head">
                        <div>
                            <h2>Settings</h2>
                        </div>
                        <div
                            className="close"
                            onClick={() => {
                                this.props.toggleUploadModal();
                            }}
                        >
                            X
                        </div>
                    </div>
                    <div className="uploader-body">
                        <div className="pane one">
                            <h2>here are stats and functions</h2>
                            <p>
                                User since:{" "}
                                {new Date(
                                    this.props.userSince
                                ).toLocaleDateString()}
                            </p>
                            <p>
                                Number of Friends: {this.props.numberOfFriends}
                            </p>
                            <button
                                disabled={this.state.loading}
                                onClick={this.deleteAccount}
                            >
                                {this.state.confirm || "delete Account"}
                            </button>
                        </div>
                        <div className="pane two">
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
                                    {this.state.filename ||
                                        "Please select an image"}
                                </span>
                            </label>
                            <button
                                className={
                                    (this.state.error && "error-btn") || " "
                                }
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
                            <img
                                className="upload-image"
                                src="/On_the_rock.jpg"
                            />
                        </div>
                        <div
                            className="pane slider"
                            onMouseDown={this.startDrag}
                            onMouseUp={this.stopDrag}
                        ></div>
                    </div>
                </div>
            </div>
        );
    }
}
