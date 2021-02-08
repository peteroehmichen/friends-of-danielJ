import React from "react";
import axios from "axios";
/*
show input field
keep track of variables and present log-in button with aios
render error

*/

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            first: "",
            last: "",
            email: "",
            password: "",
            // filledFields: {},
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
            this.state.email == "" ||
            this.state.password == ""
        ) {
            // console.log("Error");
            this.setState({
                error: "please fill out all the fields",
            });
        } else {
            // console.log("Sending:");
            axios
                .post("/registration", this.state)
                .then((res) => {
                    console.log("answer from axios.post:", res.data);
                    if (res.data.id) {
                        this.setState({
                            error: false,
                        });
                        location.replace("/");
                    } else {
                        let msg;
                        if (res.data.error == "23505") {
                            msg = "E-Mail already exists";
                        } else if (res.data.error == "23502") {
                            msg =
                                "please check input quality (i.e. E-Mail with @ and no empty fields)";
                        }

                        this.setState({
                            error: msg,
                        });
                    }
                })
                .catch((err) => {
                    console.log("caught in catch of axios-post:", err);
                    this.setState({
                        error: "Unkown Error during contact to Database",
                    });
                });
        }
        // if (this.state.first == "a") {
        // }
    }

    render() {
        // form causes a reload of the page - prevent default?
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
                    <div>
                        Already a user? Log In <a href="#">here</a>
                    </div>
                </div>
            </div>
        );
    }
}
