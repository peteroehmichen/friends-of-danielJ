// only render welcome page if the user specifically requests it. (is being sent there by server)

import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";

import Welcome from "./welcome";
import App, { App2 } from "./app";
import reducer from "./reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname === "/welcome") {
    elem = (
        <Provider store={store}>
            <Welcome />
        </Provider>
    );
} else {
    elem = (
        <Provider store={store}>
            <App2 />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
