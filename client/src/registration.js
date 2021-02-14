import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { formEval, Spinner } from "./helpers";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            loading: false,
            first: "",
            last: "",
            email: "",
            password: "",
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
        // console.log("Evaluated:", this.state);
    }

    submitHandler() {
        // console.log("Submit happened for", this.state);

        if (
            this.state.first == "" ||
            this.state.last == "" ||
            !this.state.email.includes("@") ||
            this.state.password == ""
        ) {
            // console.log("Error");
            this.setState({
                error: "please fill out all the fields",
            });
        } else {
            this.setState({ loading: true });
            axios
                .post("/api/registration.json", this.state)
                .then((res) => {
                    // console.log("answer from axios.post:", res.data);
                    if (res.data.id) {
                        this.setState({
                            error: false,
                        });
                        location.replace("/");
                    } else {
                        this.setState({
                            error: res.data.error,
                            loading: false,
                        });
                    }
                })
                .catch((err) => {
                    // console.log("caught in catch of axios-post:", err);
                    this.setState({
                        error: "Unkown Error during contact to Database",
                        loading: false,
                    });
                });
        }
    }

    render() {
        return (
            <div className="welcome-blocks register">
                <div className="title">
                    <h3>Please sign up with your personal information</h3>
                </div>
                <div className="form">
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="text"
                        name="first"
                        placeholder="First name"
                        autoComplete="new-password"
                    />
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="text"
                        name="last"
                        placeholder="Last name"
                    />
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
                            !this.state.first ||
                            !this.state.last ||
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
                            "Register"
                        )}
                    </button>
                </div>
                <div className="welcome-footnote">
                    <p>
                        Already a user? Click here to{" "}
                        <Link to="/login">log in</Link>
                    </p>
                </div>
            </div>
        );
    }
}
