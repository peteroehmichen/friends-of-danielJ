import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "./action";
import axios from "./axios";
import Countdown from "./countdown";
import FriendButton from "./friendButton";

// FIXME second loaded no friend button

export function OtherProfile3(props) {
    const dispatch = useDispatch();
    const { first, last, profilePicUrl, bio, error } = useSelector(
        (store) => store.otherUser
    );

    useEffect(async () => {
        dispatch(getUserData(props.match.params.id));
    }, []);

    if (!first && !error) return null;
    // const [friendBtnText, setFriendBtnText] = useState("");

    const otherUser = (
        <div className="main-view own-profile">
            <img
                className="profile-picture large"
                src={profilePicUrl}
                alt={first}
                onError={(e) => {
                    e.target.setAttribute("src", "");
                }}
            />

            <div className="profile-information">
                <h1>
                    {first} {last}
                </h1>
                <p>{bio}</p>
                <FriendButton friendId={props.match.params.id} />
            </div>
        </div>
    );
    const errorBlock = (
        <div className="main-view own-profile">
            <h4>
                Automatically redirecting you to Start-Page in{" "}
                <Countdown
                    deadline={Date.now() + 10000}
                    actionOnEnd={() => props.history.push("/")}
                />{" "}
                seconds
            </h4>
        </div>
    );

    return (error && errorBlock) || otherUser;
}

// old stuff after here

export function OtherProfile2(props) {
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [bio, setBio] = useState("");
    const [error, setError] = useState(false);
    const [friendBtnText, setFriendBtnText] = useState("");

    useEffect(async () => {
        try {
            const { data } = await axios.get(
                `/api/user/data.json?id=${props.match.params.id}`
            );
            if (data.error) {
                setError(data.error);
            } else {
                setFirst(data.first);
                setLast(data.last);
                setProfilePicUrl(data.profilePicUrl || "/default.jpg");
                setBio(data.bio);
                setError(false);
            }
        } catch (err) {
            console.log("error in Axios for other user:", err);
        }
    }, []);

    const otherUser = (
        <div className="other-profile debug-green">
            <h2>
                {first} {last}
            </h2>
            <h4>{bio}</h4>
            <div className="profile-pic-main">
                <img
                    src={profilePicUrl}
                    alt={first}
                    onError={(e) => {
                        e.target.setAttribute("src", "");
                    }}
                />
            </div>
            <FriendButton friendId={props.match.params.id} />
        </div>
    );
    const errorBlock = (
        <div className="other-profile debug-green">
            <h2>{error}</h2>
            <h4>
                Automatically redirecting you to Start-Page in{" "}
                <Countdown
                    deadline={Date.now() + 10000}
                    actionOnEnd={() => props.history.push("/")}
                />{" "}
                seconds
            </h4>
        </div>
    );

    return (error && errorBlock) || otherUser;
}

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            profilePicUrl: "",
            bio: "",
            error: false,
            friendBtnText: "",
        };
    }

    async componentDidMount() {
        try {
            const { data } = await axios.get(
                `/api/user/data.json?id=${this.props.match.params.id}`
            );
            if (data.error) {
                this.setState({
                    error: data.error,
                });
            } else {
                this.setState({
                    first: data.first,
                    last: data.last,
                    profilePicUrl: data.profilePicUrl || "/default.jpg",
                    bio: data.bio,
                    error: false,
                });
            }
        } catch (err) {
            console.log("error in Axios for other user:", err);
        }
    }

    render() {
        const otherUser = (
            <div className="other-profile debug-green">
                <h2>
                    {this.state.first} {this.state.last}
                </h2>
                <h4>{this.state.bio}</h4>
                <div className="profile-pic-main">
                    <img
                        src={this.state.profilePicUrl}
                        alt={this.state.first}
                        onError={(e) => {
                            e.target.setAttribute("src", "");
                        }}
                    />
                </div>
                <FriendButton friendId={this.props.match.params.id} />
            </div>
        );
        const error = (
            <div className="other-profile debug-green">
                <h2>{this.state.error}</h2>
                <h4>
                    Automatically redirecting you to Start-Page in{" "}
                    <Countdown
                        deadline={Date.now() + 10000}
                        actionOnEnd={() => this.props.history.push("/")}
                    />{" "}
                    seconds
                </h4>
            </div>
        );
        return (this.state.error && error) || otherUser;
    }
}
