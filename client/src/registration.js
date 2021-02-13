import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            first: "",
            last: "",
            email: "",
            password: "",
        };
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
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
                        });
                    }
                })
                .catch((err) => {
                    // console.log("caught in catch of axios-post:", err);
                    this.setState({
                        error: "Unkown Error during contact to Database",
                    });
                });
        }
    }

    render() {
        return (
            <div className="register">
                <div className="registerTitle">
                    <h2>We require the following information</h2>
                </div>
                <div className="form">
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="text"
                        name="first"
                        placeholder="First name"
                    />
                    <input
                        onChange={(e) => this.changeHandler(e)}
                        type="text"
                        name="last"
                        placeholder="Last name"
                    />
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
                        Already a user? Click here to{" "}
                        <Link to="/login">log in</Link>
                    </p>
                </div>
            </div>
        );
    }
}
