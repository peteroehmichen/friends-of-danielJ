import axios from "./axios";
import React from "react";

// still need to block upload button when uploading

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: "",
        };
        this.selectHandler = this.selectHandler.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
    }

    selectHandler(e) {
        // console.log("e.target:", e);
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

    uploadPicture() {
        // axios post with formdata, S3, SQL, receiving URL
        // this.props.setProfilePicUrl("test");
        // console.log("what to upload:", this.state);
        const profilePicture = new FormData();
        profilePicture.append("file", this.state.file);

        axios
            .post("/profile-pic", profilePicture)
            .then((response) => {
                // console.log("Upload Post received:", response);
                this.props.setProfilePicUrl(response.data.url);
            })
            .catch((err) => {
                console.log("error in Upload Post:", err);
            });
    }

    render() {
        return (
            <div className="modal">
                <div className="upload-modal">
                    <h1>This is the upload functionality</h1>
                    <input key={4} type="file" onChange={this.selectHandler} />
                    <button
                        onClick={() => {
                            this.uploadPicture();
                        }}
                    >
                        Upload picture
                    </button>
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
