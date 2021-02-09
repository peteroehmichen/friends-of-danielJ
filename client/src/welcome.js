import { HashRouter, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import PasswordReset from "./passwordReset";
// Welcome component to render register or login (full not logged-in experience)
// sole purpose is to create the pane for registration component

// called "dumb" or "presentational" components (because they dont have much functionaility. - "Pre-hooks")
export default function Welcome() {
    return (
        <div>
            <h1>Welcome!</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={PasswordReset} />
                </div>
            </HashRouter>
        </div>
    );
}
