import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    changeHandler(e) {
        // console.log("Input detected");
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submitHandler() {
        // console.log("submit detected, sending", this.state);
        axios
            .post("/login", this.state)
            .then((result) => {
                console.log("received from axios.post:", result);
                if (result.data.first) {
                    this.setState({
                        error: false,
                    });
                    location.replace("/");
                    // could send along the name...
                } else if (result.data.error) {
                    let msg = result.data.error;
                    this.setState({
                        error: msg,
                    });
                }
            })
            .catch((err) => {
                console.log("error in axios loginPost", err);
                this.setState({
                    error: "Unkown Error during contact to Database",
                });
            });
    }

    render() {
        return (
            <div className="login">
                <div className="loginTitle">
                    <h2>We require the following information</h2>
                </div>
                <div className="form">
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="text"
                        name="email"
                        placeholder="E-Mail"
                    />
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="password"
                        name="password"
                        placeholder="password"
                    />
                    <button onClick={() => this.submitHandler()}>Submit</button>
                    <div className="error">
                        {this.state.error && <p>{this.state.error}</p>}
                    </div>
                    <p>
                        Not yet a user? Click here to{" "}
                        <Link to="/">register</Link>
                    </p>
                    <p>
                        Forgot your password? Click here to{" "}
                        <Link to="/reset">reset</Link>
                    </p>
                </div>
            </div>
        );
    }
}
