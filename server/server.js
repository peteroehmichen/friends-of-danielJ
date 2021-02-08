const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

const db = require("./db");
const { hash, compare } = require("./authenticate");

let cookie_secret = process.env.cookie_secret
    ? process.env.cookie_secret
    : require("../secrets.json").secretOfSession;

app.use(
    cookieSession({
        secret: cookie_secret,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
);

app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

// app.use((req, res, next) => {
//     console.log("Request", req.session.userId, req.method, req.url);
//     console.log("-------------");
//     next();
// });

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    if (first == "" || last == "" || !email.includes("@") || password == "") {
        res.json({ error: "23502" }); // same error code when DB reject an empty field
    } else {
        return hash(password)
            .then((hashedPw) => {
                db.addUser(first, last, email, hashedPw)
                    .then((result) => {
                        // console.log("Setting cookie to:", result.rows[0].id);
                        req.session.userId = result.rows[0].id;
                        res.json(result.rows[0]);
                    })
                    .catch((err) => {
                        console.log("details on error:", err);
                        res.json({ error: err.code });
                    });
            })
            .catch((err) => console.log("Error in adding User:", err));
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
