import axios from "axios";

const instance = axios.create({
    xsrfCookieName: "myCookieSecret",
    xsrfHeaderName: "csrf-token",
});

export default instance;
