import React, { useEffect } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import Uploader from "./uploader";
import Logo from "./logo";
import ProfilePic from "./profilePic";
import axios from "./axios";
import Profile from "./profile";
import OtherProfile, { OtherProfile2, OtherProfile3 } from "./otherProfile";
import BioEditor from "./bioEditor";
import FindFriends from "./findFriends";
import { Spinner } from "./helpers";
import Friends from "./friends";
import Chat from "./chat";
import Countdown from "./countdown";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, toggleUploadModal } from "./action";
import Fader from "./fader";

export function App2() {
    const dispatch = useDispatch();
    const { user, activateUploadModal } = useSelector((store) => store);
    useEffect(() => {
        document.querySelector("main").style.backgroundImage = "none";
        // dispatch(getUserData("0"));
    }, []);

    if (!user) return null;

    return (
        <BrowserRouter>
            <div className="app-frame debug-black">
                {user.error && (
                    <div className="overlay">
                        <div className="uploader">
                            <img
                                className="errorGIF"
                                src="https://media.giphy.com/media/m2hjlbNbSRGy4/giphy.gif"
                            />
                            <h2>{user.error}</h2>
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

                <div className="header">
                    <Logo design="logo-nav" withTitle="true" />
                    <div className="header-right">
                        <ProfilePic size="small" />
                        <div className="header-nav">
                            <a href="/logout">
                                <img
                                    src="/logOut.svg"
                                    alt="Log Out"
                                    className="logout-icon"
                                />
                            </a>
                            <img
                                src="/settings.svg"
                                onClick={() => {
                                    dispatch(toggleUploadModal());
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="nav-bar">
                    <Link to="/">
                        <div className="nav-element">My Profile</div>
                    </Link>
                    <Link to="/chat">
                        <div className="nav-element">Chat</div>
                    </Link>
                    <Link to="/friends">
                        <div className="nav-element">Friends</div>
                    </Link>
                    <Link to="/users">
                        <div className="nav-element">find People</div>
                    </Link>
                </div>
                <div className="app-main">
                    <div className="app-main-left">
                        <Fader />
                    </div>
                    <div className="app-main-right">
                        {activateUploadModal && <Uploader />}
                        <Route exact path="/" render={() => <Profile />} />
                        <Route
                            path="/chat"
                            render={(props) => <Chat history={props.history} />}
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
                                <OtherProfile3
                                    key={props.match.url}
                                    history={props.history}
                                    match={props.match}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

// <div>
//     <h1 onClick={() => dispatch(toggleUploadModal())}>Hello</h1>
// </div>

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            email: "",
            bio: "",
            total: "",
            userSince: "",
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
                total: result.data.total,
                userSince: result.data.created_at,
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

                    <div className="header">
                        <Logo />
                        <div className="header-right">
                            <ProfilePic
                                first={this.state.first}
                                profilePicUrl={this.state.profilePicUrl}
                                size="small"
                                toggleUploadModal={this.toggleUploadModal}
                            />
                            <div className="header-nav">
                                <a href="/logout">
                                    <img
                                        src="/logOut.svg"
                                        alt="Log Out"
                                        className="logout-icon"
                                    />
                                </a>
                                <img
                                    src="/settings.svg"
                                    onClick={this.toggleUploadModal}
                                />
                            </div>
                        </div>
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
                                numberOfFriends={this.state.total}
                                userSince={this.state.userSince}
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
