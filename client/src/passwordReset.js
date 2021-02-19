import React, { useState } from "react";
import { Redirect } from "react-router";
import { Link, withRouter } from "react-router-dom";
import axios from "./axios";
import Countdown from "./countdown";
import { formEval, Spinner, useFormEval } from "./helpers";

// FIXME redirect on large Countdown leeds to memory leak
// TODO nicer redirect after end
// FIXME remove error on change of input

export default function PasswordReset(props) {
    const [values, handleChangeEval] = useFormEval();
    const [step, setStep] = useState(1);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [codeValidUntil, setCodeValidUntil] = useState(0);
    let renderStep;

    const submitReset = async function () {
        try {
            setLoading(true);
            const result = await axios.post("/api/password/reset.json", {
                email: values.email,
            });
            if (result.data.codeValidUntil) {
                setCodeValidUntil(result.data.codeValidUntil);
                setError(false);
                setLoading(false);
                // console.log("codevalid:", codeValidUntil);
                setStep(2);
            } else {
                setError(result.data.error);
                setTimeout(() => {
                    setError(false);
                }, 3000);
                setLoading(false);
            }
        } catch (err) {
            console.log("Error in POST Reset", err);
            setError("There was a Server Error");
            setTimeout(() => {
                setError(false);
            }, 3000);
            setLoading(false);
        }
        // if (!values.email.includes("@")) {
        //     setError("Field is incorrectly filled");
        // } else {
        // }
    };

    const submitCode = async function () {
        try {
            setLoading(true);
            const result = await axios.post("/api/password/code.json", {
                code: values.code,
                password: values.password,
                email: values.email,
            });
            if (result.data.update == "ok") {
                setError(false);
                setLoading(false);
                setStep(3);
            } else {
                setError(result.data.error);
                setTimeout(() => {
                    setError(false);
                }, 3000);
                setLoading(false);
            }
        } catch (err) {
            console.log("Error in POST Reset", err);
            setLoading(false);
        }
        // if (values.code == "" || values.password == "") {
        //     setError("Fields cannot be empty");
        // } else {
        // }
    };

    const toggleRedirect = function () {
        // props.history.push("/login");
        // location.replace("/login");
        console.log("Still to do");
    };

    if (step == 1) {
        renderStep = (
            <div className="form">
                <input
                    onChange={handleChangeEval}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="E-Mail"
                    key={1}
                />
                <button
                    className={(error && "error-btn") || " "}
                    disabled={!values.email || error || loading}
                    onClick={submitReset}
                >
                    {error ? error : loading ? <Spinner /> : "Request Code"}
                </button>
            </div>
        );
    } else if (step == 2) {
        renderStep = (
            <div className="form">
                <h4>
                    remaining Time:{" "}
                    <Countdown
                        deadline={codeValidUntil}
                        actionOnEnd={toggleRedirect}
                    />
                </h4>
                <input
                    onChange={handleChangeEval}
                    type="text"
                    name="code"
                    id="code"
                    placeholder="Your Reset Code"
                    key={2}
                />
                <input
                    onChange={handleChangeEval}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="New password"
                    key={3}
                />
                <button
                    className={(error && "error-btn") || " "}
                    disabled={
                        !values.code || !values.password || error || loading
                    }
                    onClick={submitCode}
                >
                    {error ? error : loading ? <Spinner /> : "Send Code"}
                </button>
            </div>
        );
    } else if (step == 3) {
        if (error) {
            renderStep = (
                <div className="form error">{error && <p>{error}</p>}</div>
            );
        } else {
            renderStep = (
                <div className="form">
                    <h1>✔︎</h1>
                </div>
            );
        }
    }
    // <p>
    //     Redirecting to LogIn in{" "}
    //     <Countdown
    //         deadline={Date.now() + 5000}
    //         actionOnEnd={toggleRedirect}
    //     />{" "}
    //     seconds
    // </p>

    return (
        <div className="welcome-blocks reset">
            <div className="title">
                <h3>Reset your password...</h3>
            </div>
            {renderStep}
            <div className="welcome-footnote">
                <p>
                    Go back to Log In Page. <Link to="/login">click here</Link>
                </p>
            </div>
        </div>
    );
}

/*
export default class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            code: "",
            codeValidUntil: 0,
            error: false,
            step: 1,
            loading: false,
        };
        this.toggleRedirect = this.toggleRedirect.bind(this);
    }

    toggleRedirect() {
        this.props.history.push("/login");
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
    // FIXME set Countdown to action
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
                        <Countdown
                            deadline={this.state.codeValidUntil}
                            actionOnEnd={this.toggleRedirect}
                        />
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
*/
