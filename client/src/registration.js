import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { formEval, Spinner, useAthenticate, useFormEval } from "./helpers";

export default function Registration() {
    const [values, handleChangeEval] = useFormEval();
    const [status, handleAuthSubmit] = useAthenticate(
        "/api/registration.json",
        values
    );

    return (
        <div className="welcome-blocks register">
            <div className="title">
                <h3>Please sign up with your personal information</h3>
            </div>
            <div className="form">
                <input
                    onChange={handleChangeEval}
                    type="text"
                    name="first"
                    placeholder="First name"
                    autoComplete="new-password"
                />
                <input
                    onChange={handleChangeEval}
                    type="text"
                    name="last"
                    placeholder="Last name"
                />
                <input
                    onChange={handleChangeEval}
                    type="email"
                    name="email"
                    placeholder="E-Mail"
                />
                <input
                    onChange={handleChangeEval}
                    type="password"
                    name="password"
                    placeholder="password"
                />
                <button
                    className={(status.error && "error-btn") || " "}
                    disabled={
                        !values.first ||
                        !values.last ||
                        !values.email ||
                        !values.password ||
                        status.error ||
                        status.loading
                    }
                    onClick={handleAuthSubmit}
                >
                    {status.error ? (
                        status.error
                    ) : status.loading ? (
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

/*
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
    }
    async submitHandler() {
        if (
            this.state.first == "" ||
            this.state.last == "" ||
            !this.state.email.includes("@") ||
            this.state.password == ""
        ) {
            // console.log("Error");
            this.setState({
                error: "Incomplete Data",
            });
        } else {
            this.setState({ loading: true });
            try {
                const res = await axios.post(
                    "/api/registration.json",
                    this.state
                );
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
            } catch (err) {
                console.log("caught in catch of axios-post:", err);
                this.setState({
                    error: "No Database connection",
                    loading: false,
                });
            }
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
*/
