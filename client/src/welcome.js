import { HashRouter, Route } from "react-router-dom";
import { Fragment, useEffect } from "react";
import Registration from "./registration";
import Login from "./login";
import PasswordReset from "./passwordReset";
import Logo from "./logo";
// Welcome component to render register or login (full not logged-in experience)
// sole purpose is to create the pane for registration component

// called "dumb" or "presentational" components (because they dont have much functionaility. - "Pre-hooks")
export default function Welcome() {
    useEffect(() => {
        document.querySelector("main").style.backgroundImage =
            "url('bg_intro.jpg')";
    }, []);
    return (
        <Fragment>
            <div className="welcome">
                <div className="welcome-intro">
                    <h1>Friends of Daniel Johnston</h1>
                    <p>
                        This site is dedicated to Daniel Johnston - a true
                        artist in music and art. Join this community of
                        likeminded people, interact and make new friends.
                    </p>
                    <p>We are more than we think.</p>
                </div>
                <div className="welcome-frame">
                    <div className="logo-frame">
                        <Logo design="logo-front" />
                    </div>
                    <HashRouter>
                        <Fragment>
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                            <Route path="/reset" component={PasswordReset} />
                        </Fragment>
                    </HashRouter>
                </div>
            </div>
        </Fragment>
    );
}
