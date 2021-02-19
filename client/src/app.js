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
import { Spinner } from "./helpers";
import Friends from "./friends";
import Countdown from "./countdown";

// FIXME on db-error in bio and sub-elements full reload /.
// TODO create an effective loading spinner for full pages

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

    async componentDidMount() {
        // console.log("running a axios request...");
        try {
            const result = await axios.get("/api/user/data.json?id=0");
            this.setState({
                first: result.data.first,
                last: result.data.last,
                bio: result.data.bio,
                profilePicUrl: result.data.profilePicUrl || "/default_user.svg",
                error: result.data.error,
            });
        } catch (err) {
            console.log("Received an error on /user:", err);
            this.setState({
                error: "No Connection to Database",
            });
        }
    }

    toggleUploadModal() {
        // console.log("modal:", this.state.activateUploadModal);
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
                    {this.state.error && (
                        <div className="overlay">
                            <div className="uploader">
                                <img
                                    className="errorGIF"
                                    src="https://media.giphy.com/media/m2hjlbNbSRGy4/giphy.gif"
                                />
                                <h2>{this.state.error}</h2>
                                <p>
                                    Logging Out in{" "}
                                    <Countdown
                                        deadline={Date.now() + 10000}
                                        actionOnEnd={() =>
                                            location.replace("/logout")
                                        }
                                    />
                                </p>
                            </div>
                        </div>
                    )}

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
                                src="/logOut.svg"
                                alt="Log Out"
                                className="logout-icon"
                            />
                        </a>
                    </div>
                    <div className="nav-bar">
                        <Link to="/">
                            <div className="nav-element">own Profile</div>
                        </Link>
                        <Link to="/friends">
                            <div className="nav-element">Friend & Requests</div>
                        </Link>
                        <Link to="/users">
                            <div className="nav-element">find Friends</div>
                        </Link>
                    </div>
                    <div className="app-main">
                        {this.state.activateUploadModal && (
                            <Uploader
                                toggleUploadModal={this.toggleUploadModal}
                                setProfilePicUrl={this.setProfilePicUrl}
                            />
                        )}
                        <Route
                            exact
                            path="/"
                            render={(props) => (
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
                        <Route
                            path="/friends"
                            render={(props) => (
                                <Friends history={props.history} />
                            )}
                        />
                        <Route
                            path="/users"
                            render={(props) => (
                                <FindFriends history={props.history} />
                            )}
                        />
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
