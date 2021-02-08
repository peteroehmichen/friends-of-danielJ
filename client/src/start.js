// only render welcome page if the user specifically requests it. (is being sent there by server)

import ReactDOM from "react-dom";
import Welcome from "./welcome";
import SignedIn from "./logo";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <Logo />;
}

ReactDOM.render(elem, document.querySelector("main"));
