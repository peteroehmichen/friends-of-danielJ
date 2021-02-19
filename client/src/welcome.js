import { HashRouter, Route } from "react-router-dom";
import { Fragment } from "react";
import Registration from "./registration";
import Login from "./login";
import PasswordReset from "./passwordReset";
import Logo from "./logo";
// Welcome component to render register or login (full not logged-in experience)
// sole purpose is to create the pane for registration component

// called "dumb" or "presentational" components (because they dont have much functionaility. - "Pre-hooks")
export default function Welcome(props) {
    return (
        <Fragment>
            <Logo />
            <div className="welcome">
                <div className="welcome-intro">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Enim, consequuntur cum! Qui libero odio, ducimus
                        molestiae aperiam nemo eos quis sed eveniet dolor, quam
                        ipsam excepturi deserunt suscipit provident ea.
                    </p>
                </div>
                <HashRouter>
                    <Fragment>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Route path="/reset" component={PasswordReset} />
                    </Fragment>
                </HashRouter>
            </div>
        </Fragment>
    );
}
