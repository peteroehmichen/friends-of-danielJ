import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import Countdown from "./countdown";

export default class PasswordReset extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            code: "",
            error: false,
            step: 1,
        };
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
        // console.log(this.state);
    }

    submitReset() {
        if (!this.state.email.includes("@")) {
            // console.log("incorrect mail");
            this.setState({ error: "Field is incorrectly filled" });
        } else {
            axios
                .post("/password/reset/start", { email: this.state.email })
                .then((result) => {
                    console.log("result from POST RESET", result);
                    if (result.data.codeValidUntil) {
                        this.setState({
                            codeValidUntil: result.data.codeValidUntil,
                            step: 2,
                            error: false,
                        });
                    } else {
                        this.setState({
                            error: result.data.error,
                        });
                    }
                })
                .catch((err) => {
                    console.log("Error in POST Reset", err);
                    this.setState({
                        error: "There was a server Error",
                    });
                });
        }
    }

    submitCode() {
        if (this.state.code == "" || this.state.password == "") {
            this.setState({ error: "Fields cannot be empty" });
        } else {
            axios
                .post("/password/reset/code", {
                    code: this.state.code,
                    password: this.state.password,
                    email: this.state.email,
                })
                .then((result) => {
                    // console.log("result from POST CODE", result.data);
                    if (result.data.update == "ok") {
                        // console.log("accept it all");
                        this.setState({
                            step: 3,
                            error: false,
                        });
                    } else {
                        this.setState({
                            error: result.data.error,
                        });
                    }
                })
                .catch((err) => {
                    console.log("Error in POST Reset", err);
                });
        }

        // console.log("submitting the code");
        // console.log(this.state);
    }

    renderStep() {
        if (this.state.step === 1) {
            return (
                <div>
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="E-Mail"
                        key={1}
                    />
                    <button onClick={() => this.submitReset()}>Submit</button>
                </div>
            );
        } else if (this.state.step === 2) {
            return (
                <div>
                    <h4>
                        remaining Time:{" "}
                        <Countdown codeValidUntil={this.state.codeValidUntil} />
                    </h4>
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="text"
                        name="code"
                        id="code"
                        placeholder="Your Reset Code"
                        key={2}
                    />
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="New password"
                        key={3}
                    />
                    <button onClick={() => this.submitCode()}>Submit</button>
                </div>
            );
        } else if (this.state.step === 3) {
            return (
                <div>
                    <h3>Password Reset successfull</h3>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="reset">
                <div className="loginTitle">
                    <h2>We require the following information</h2>
                </div>
                {this.renderStep()}
                <div className="error">
                    {this.state.error && <p>{this.state.error}</p>}
                </div>
                <p>
                    Go back to Log In Page. <Link to="/login">Click here</Link>
                </p>
            </div>
        );
    }
}
