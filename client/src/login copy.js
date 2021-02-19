import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import { formEval, Spinner } from "./helpers";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
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

    async submitHandler() {
        this.setState({ loading: true });
        try {
            const result = await axios.post("/api/login.json", this.state);
            if (result.data.first) {
                this.setState({
                    error: false,
                });
                location.replace("/");
            } else if (result.data.error) {
                let msg = result.data.error;
                this.setState({
                    error: msg,
                    loading: false,
                });
            }
        } catch (err) {
            console.log("error in axios loginPost", err);
            this.setState({
                error: "No Database Connection",
                loading: false,
            });
        }
    }

    render() {
        return (
            <div className="welcome-blocks login">
                <div className="title">
                    <h3>please log in with your email address</h3>
                </div>
                <div className="form">
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="email"
                        name="email"
                        placeholder="E-Mail"
                    />
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="password"
                        name="password"
                        placeholder="password"
                    />
                    <button
                        className={(this.state.error && "error-btn") || " "}
                        disabled={
                            !this.state.email ||
                            !this.state.password ||
                            this.state.error ||
                            this.state.loading
                        }
                        onClick={() => this.submitHandler()}
                    >
                        {this.state.error ? (
                            this.state.error
                        ) : this.state.loading ? (
                            <Spinner />
                        ) : (
                            "Log In"
                        )}
                    </button>
                </div>
                <div className="welcome-footnote">
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
