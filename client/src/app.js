import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Uploader from "./uploader";
import Logo from "./logo";
import ProfilePic from "./profilePic";
import axios from "./axios";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import BioEditor from "./bioEditor";
import FindFriends from "./findFriends";

// still need to handle error messages...

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            email: "",
            bio: "",
            profilePicUrl: "",
            activateUploadModal: false,
        };
        this.toggleUploadModal = this.toggleUploadModal.bind(this);
        this.setProfilePicUrl = this.setProfilePicUrl.bind(this);
        this.setBio = this.setBio.bind(this);
        // this.render = this.render.bind(this);
    }

    componentDidMount() {
        // console.log("running a axios request...");
        axios
            .post("/api/user/data.json", { id: 0 })
            .then((result) => {
                // console.log("received from /user:", result);
                this.setState({
                    first: result.data.first,
                    last: result.data.last,
                    bio: result.data.bio,
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
        this.toggleUploadModal();
        //
    }

    setBio(bio) {
        // console.log("Setting profile BIO:", bio);
        this.setState({
            bio: bio,
        });
    }

    render() {
        document.querySelector("main").style.backgroundImage = "none";
        return (
            <BrowserRouter>
                <div className="app-frame debug-black">
                    <div className="header debug-red">
                        <ProfilePic
                            first={this.state.first}
                            profilePicUrl={this.state.profilePicUrl}
                            size="small"
                            toggleUploadModal={this.toggleUploadModal}
                        />
                        <Logo />
                        <a href="/logout">
                            <img
                                src="logOut.svg"
                                alt="Log Out"
                                className="logout-icon"
                            />
                        </a>
                    </div>
                    <div className="nav-bar">
                        <Link to="/">
                            <div className="nav-element">own Profile</div>
                        </Link>
                        <Link to="/users">
                            <div className="nav-element">find Friends</div>
                        </Link>
                    </div>
                    <div className="app-main">
                        <Uploader
                            activateUploadModal={this.activateUploadModal}
                            setProfilePicUrl={this.setProfilePicUrl}
                        />

                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    profilePicUrl={this.state.profilePicUrl}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                    toggleUploadModal={this.toggleUploadModal}
                                />
                            )}
                        />
                        <Route path="/users" render={() => <FindFriends />} />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    history={props.history}
                                    match={props.match}
                                />
                            )}
                        />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
