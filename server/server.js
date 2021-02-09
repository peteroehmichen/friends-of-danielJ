const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

const db = require("./db");
const { hash, compare } = require("./authenticate");
const { sendEMail } = require("./mailing");

let cookie_secret = process.env.cookie_secret
    ? process.env.cookie_secret
    : require("../secrets.json").secretOfSession;

app.use(
    cookieSession({
        secret: cookie_secret,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
);

app.use(csurf());

app.use((req, res, next) => {
    res.cookie("myCookieSecret", req.csrfToken());
    next();
});

app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

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
                        console.log(
                            "User added to DB with id",
                            req.session.userId
                        );
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

app.post("/login", (req, res) => {
    // console.log("received:", req.body);
    db.getAuthenticatedUser(req.body.email, req.body.password)
        .then((result) => {
            // console.log("result", result);
            if (result.id) {
                req.session.userId = result.id;
                res.json({
                    first: result.first,
                    last: result.last,
                });
            } else {
                res.json(result);
            }
        })
        .catch((err) => {
            // console.log("error in authenticating user:", err);
            res.json({ error: "Log In was rejected by server" });
        });
});

app.post("/password/reset/start", (req, res) => {
    return db
        .getUserByEmail(req.body.email)
        .then((result) => {
            if (result.rowCount > 0) {
                // const user = result.rows[0];
                sendEMail(result.rows[0].email).then((code) => {
                    db.addResetCode(req.body.email, code)
                        .then((result) => {
                            res.json(result);
                        })
                        .catch((err) => {
                            console.log("Error in Writing Code to DB:", err);
                            res.json({
                                error:
                                    "Could not write Code to Database - please try again",
                            });
                        });
                });
                // go on...
            } else {
                res.json({ error: "User not found..." });
            }
        })
        .catch((err) => {
            console.log("error in reset start PW:", err);
            res.json({ error: "unknown error in DB" });
        });
});

app.post("/password/reset/code", (req, res) => {
    // console.log("welcome to POST RESET CODE with", req.body);
    return db
        .confirmCode(req.body.code, req.body.email)
        .then((isCodeValid) => {
            // console.log("check of code:", isCodeValid);
            if (isCodeValid) {
                return hash(req.body.password)
                    .then((hashedPw) => db.updateUser(req.body.email, hashedPw))
                    .then((result) => {
                        // console.log("updating user:", result);
                        if (result.rowCount > 0) {
                            res.json({ update: "ok" });
                        } else {
                            res.json({ error: "Error in resetting password" });
                        }
                    })
                    .catch((err) => {
                        console.log("error in updating user:", err);
                        res.json({ error: "error in updating user" });
                    });
            }
        })
        .catch((err) => {
            console.log("there was an error in code-confirmation:", err);
            res.json({ error: "there was an error in code-confirmation" });
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    console.log("All user cookies deleted");
    res.redirect("/welcome");
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
