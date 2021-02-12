const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { CODE_VALIDITY_IN_MINUTES } = require("../config.json");

const db = require("./db");
const { hash, compare } = require("./authenticate");
const { sendEMail, uploader, uploadToAWS } = require("./aws");

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

app.post("/api/registration.json", (req, res) => {
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

app.post("/api/login.json", (req, res) => {
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

app.post("/api/password/reset.json", (req, res) => {
    return db
        .getUserByEmail(req.body.email)
        .then((result) => {
            if (result.rowCount > 0) {
                // const user = result.rows[0];
                sendEMail(result.rows[0].email).then((code) => {
                    db.addResetCode(req.body.email, code)
                        .then((result) => {
                            if (result.rowCount > 0) {
                                // console.log(result.rows[0].created_at);
                                let startDate = new Date(
                                    result.rows[0].created_at
                                );
                                let endDate = new Date(
                                    startDate.getTime() +
                                        CODE_VALIDITY_IN_MINUTES * 60000
                                ).valueOf();
                                res.json({ codeValidUntil: endDate });
                            } else {
                                console.log("couldnt read addUser-Result");
                                res.json({
                                    error: "couldnt read addUser-Result",
                                });
                            }
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

app.post("/api/password/code.json", (req, res) => {
    // console.log("welcome to POST RESET CODE with", req.body);
    return db
        .confirmCode(
            req.body.code,
            CODE_VALIDITY_IN_MINUTES.toString(),
            req.body.email
        )
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
            } else {
                res.json({ error: "Code is invalid" });
            }
        })
        .catch((err) => {
            console.log("there was an error in code-confirmation:", err);
            res.json({ error: "there was an error in code-confirmation" });
        });
});

app.post("/api/user/data.json", async (req, res) => {
    console.log("received to /user.json:", req.body);
    if (req.body.id == req.session.userId) {
        return res.json({ error: "requesting identical user" });
    }
    const idForDb = req.body.id == 0 ? req.session.userId : req.body.id;
    try {
        const result = await db.getUserById(idForDb);
        if (result.rowCount > 0) {
            return res.json({
                first: result.rows[0].first,
                last: result.rows[0].last,
                url: result.rows[0].profile_pic_url,
                bio: result.rows[0].bio,
            });
        } else {
            res.json({ error: "user could not be found" });
        }
    } catch (err) {
        res.json({ error: "DB Error" });
    }
});

// pre-async-version

// app.get("/user", (req, res) => {
//     return db
//         .getUserById(req.session.userId)
//         .then((result) => {
//             if (result.rowCount > 0) {
//                 return res.json({
//                     first: result.rows[0].first,
//                     last: result.rows[0].last,
//                     url: result.rows[0].profile_pic_url,
//                     bio: result.rows[0].bio,
//                 });
//             } else {
//                 res.json({ error: "user could not be found" });
//             }
//         })
//         .catch((err) => res.json({ error: "DB Error" }));
// });

app.post(
    "/api/user/profile-pic.json",
    uploader.single("file"),
    async (req, res) => {
        try {
            const aws = await uploadToAWS(req);
            let sql;
            if (aws.url) {
                sql = await db.addProfilePic(aws.url, req.session.userId);
            }
            if (sql.rowCount > 0) {
                res.json(aws);
            } else {
                res.json({ error: "DB rejected new picture" });
            }
        } catch (error) {
            res.json({ error: "Upload failed - please try again" });
        }
    }
);

// pre-async-version

// app.post("/profile-pic", uploader.single("file"), uploadToAWS, (req, res) => {
//     // console.log("PostRoute body:", req.body.url);
//     // console.log("PostRoute file:", req.file);
//     db.addProfilePic(req.body.url, req.session.userId)
//         .then((result) => {
//             // console.log("DB-Result:", result);
//             if (result.rowCount > 0) {
//                 res.json({ url: req.body.url });
//             } else {
//                 res.json({ error: "DB rejected new picture" });
//             }
//         })
//         .catch((err) => res.json({ error: "couldn't write to DB:", err }));

//     // res.json({ error: "temporary response" });
// });

app.post("/api/profile-bio.json", (req, res) => {
    // console.log("Server received BIO POST:", req.body);
    db.addBio(req.body.bio, req.session.userId)
        .then((result) => {
            // console.log(result);
            if (result.rowCount > 0) {
                res.json({ update: "success" });
            } else {
                res.json({ error: "Could not write Bio to DB" });
            }
        })
        .catch((err) => {
            res.json({ error: "DB rejected Bio" });
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
