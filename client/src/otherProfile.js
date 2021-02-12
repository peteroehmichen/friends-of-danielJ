import React from "react";
import axios from "./axios";
import Countdown from "./countdown";

// error handling: unkown id und eigener user

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            profilePicUrl: "",
            bio: "",
            error: false,
        };
    }

    componentDidMount() {
        // console.log("running a user request");
        // console.log("id:", this.props.match.params.id);
        axios
            .post("/api/user/data.json", { id: this.props.match.params.id })
            .then(({ data }) => {
                // console.log("result from axios other user:", data);
                if (data.error) {
                    this.setState({
                        error: data.error,
                    });
                } else {
                    this.setState({
                        first: data.first,
                        last: data.last,
                        profilePicUrl: data.url || "default_user.png",
                        bio: data.bio,
                        error: false,
                    });
                }
            })
            .catch((err) => {
                console.log("error in Axios for other user:", err);
            });
    }

    render() {
        const otherUser = (
            <div className="debug-green">
                <h2>
                    {this.state.first} {this.state.last}
                </h2>
                <h4>{this.state.bio}</h4>
                <img src={this.state.profilePicUrl} alt={this.state.first} />
            </div>
        );
        const error = (
            <div className="debug-green">
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
