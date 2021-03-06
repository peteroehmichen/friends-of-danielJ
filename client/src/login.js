import { Link } from "react-router-dom";
import { Spinner, useAthenticate, useFormEval } from "./helpers";

export default function Login() {
    const [values, handleChangeEval] = useFormEval();
    const [status, handleAuthSubmit] = useAthenticate(
        "/api/login.json",
        values
    );

    return (
        <div className="welcome-blocks login">
            <div className="title">
                <h3>please log in with your email address</h3>
            </div>
            <div className="form">
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
                        "Log In"
                    )}
                </button>
            </div>
            <div className="welcome-footnote">
                <p>
                    Not yet a user? Click here to <Link to="/">register</Link>
                </p>
                <p>
                    Forgot your password? Click here to{" "}
                    <Link to="/reset">reset</Link>
                </p>
            </div>
        </div>
    );
}

/*
export default class Login extends React.Component {


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
*/
