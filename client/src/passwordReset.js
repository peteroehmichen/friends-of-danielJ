import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import Countdown from "./countdown";
import { formEval, Spinner } from "./helpers";

// TODO redirect after end of Countdown

export default class PasswordReset extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            code: "",
            codeValidUntil: 0,
            error: false,
            step: 1,
            loading: false,
        };
    }

    changeHandler(e) {
        const passedValue = formEval(e);
        if (passedValue) {
            this.setState({
                [e.target.name]: passedValue,
                error: false,
            });
        } else {
            this.setState({
                [e.target.name]: "",
                error: false,
            });
        }
    }

    async submitReset() {
        if (!this.state.email.includes("@")) {
            this.setState({ error: "Field is incorrectly filled" });
        } else {
            try {
                this.setState({ loading: true });
                const result = await axios.post("/api/password/reset.json", {
                    email: this.state.email,
                });
                console.log("after", this.state);
                if (result.data.codeValidUntil) {
                    this.setState({
                        codeValidUntil: result.data.codeValidUntil,
                        step: 2,
                        error: false,
                        loading: false,
                    });
                } else {
                    this.setState({
                        error: result.data.error,
                        loading: false,
                    });
                }
            } catch (err) {
                console.log("Error in POST Reset", err);
                this.setState({
                    error: "There was a server Error",
                    loading: false,
                });
            }
        }
    }

    async submitCode() {
        if (this.state.code == "" || this.state.password == "") {
            this.setState({ error: "Fields cannot be empty" });
        } else {
            try {
                this.setState({ loading: true });
                const result = await axios.post("/api/password/code.json", {
                    code: this.state.code,
                    password: this.state.password,
                    email: this.state.email,
                });
                if (result.data.update == "ok") {
                    // console.log("accept it all");
                    this.setState({
                        step: 3,
                        error: false,
                        loading: false,
                    });
                } else {
                    this.setState({
                        error: result.data.error,
                        loading: false,
                    });
                }
            } catch (err) {
                console.log("Error in POST Reset", err);
                this.setState({ loading: false });
            }
        }
    }

    renderStep() {
        if (this.state.step === 1) {
            return (
                <div className="form">
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="E-Mail"
                        key={1}
                    />
                    <button
                        className={(this.state.error && "error-btn") || " "}
                        disabled={
                            !this.state.email ||
                            this.state.error ||
                            this.state.loading
                        }
                        onClick={() => this.submitReset()}
                    >
                        {this.state.error ? (
                            this.state.error
                        ) : this.state.loading ? (
                            <Spinner />
                        ) : (
                            "Request Code"
                        )}
                    </button>
                </div>
            );
        } else if (this.state.step === 2) {
            return (
                <div className="form">
                    <h4>
                        remaining Time:{" "}
                        <Countdown deadline={this.state.codeValidUntil} />
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
                    <button
                        className={(this.state.error && "error-btn") || " "}
                        disabled={
                            !this.state.code ||
                            !this.state.password ||
                            this.state.loading
                        }
                        onClick={() => this.submitCode()}
                    >
                        {this.state.error ? (
                            this.state.error
                        ) : this.state.loading ? (
                            <Spinner />
                        ) : (
                            "Send Code"
                        )}
                    </button>
                </div>
            );
        } else if (this.state.step === 3) {
            if (this.state.error) {
                return (
                    <div className="form error">
                        {this.state.error && <p>{this.state.error}</p>}
                    </div>
                );
            } else {
                return (
                    <div className="form">
                        <h1>✔︎</h1>
                    </div>
                );
            }
        }
    }

    render() {
        return (
            <div className="welcome-blocks reset">
                <div className="title">
                    <h3>Reset your password...</h3>
                </div>
                {this.renderStep()}
                <div className="welcome-footnote">
                    <p>
                        Go back to Log In Page.{" "}
                        <Link to="/login">click here</Link>
                    </p>
                </div>
            </div>
        );
    }
}
