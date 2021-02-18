const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const {
    CODE_VALIDITY_IN_MINUTES,
    LIMIT_OF_RECENT_USERS,
} = require("../config.json");

const db = require("./db");
const auth = require("./auth");
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
app.use(express.urlencoded({ extended: false }));

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/api/registration.json", async (req, res) => {
    const { first, last, email, password } = req.body;
    if (first == "" || last == "" || !email.includes("@") || password == "") {
        return res.json({
            error: "Prohibited input",
        });
    }
    try {
        const hashedPw = await auth.hash(password);
        const result = await db.addUser(first, last, email, hashedPw);
        req.session.userId = result.rows[0].id;
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code == "23505") {
            res.json({ error: "E-Mail already exists" });
        } else {
            res.json({ error: "Unknown error" });
        }
    }
});

app.post("/api/login.json", async (req, res) => {
    try {
        const result = await db.getAuthenticatedUser(
            req.body.email,
            req.body.password
        );
        if (result.id) {
            req.session.userId = result.id;
            res.json({
                first: result.first,
                last: result.last,
            });
        } else {
            res.json({ error: "Invalid user credentials" });
        }
    } catch (err) {
        res.json({ error: "Log in rejected" });
    }
});

app.post("/api/password/reset.json", async (req, res) => {
    try {
        const user = await db.getUserByEmail(req.body.email);
        if (user.rowCount > 0) {
            const code = await sendEMail(user.rows[0].email);
            const result = await db.addResetCode(req.body.email, code);
            if (result.rowCount > 0) {
                const start = new Date(result.rows[0].created_at);
                const end = new Date(
                    start.getTime() + CODE_VALIDITY_IN_MINUTES * 60000
                ).valueOf();
                res.json({ codeValidUntil: end });
            } else {
                res.json({
                    error: "Couldn't read DB",
                });
            }
        } else {
            res.json({ error: "User not found" });
        }
    } catch (err) {
        res.json({ error: "Unknown error in DB" });
    }
});

app.post("/api/password/code.json", async (req, res) => {
    try {
        const isCodeValid = await db.confirmCode(
            req.body.code,
            CODE_VALIDITY_IN_MINUTES.toString(),
            req.body.email
        );
        if (isCodeValid) {
            const hashedPw = await auth.hash(req.body.password);
            const result = await db.updateUser(req.body.email, hashedPw);
            if (result.rowCount > 0) {
                res.json({ update: "ok" });
            } else {
                res.json({ error: "Error in password-reset" });
            }
        } else {
            res.json({ error: "Invalid code" });
        }
    } catch (err) {
        res.json({ error: "Unknown error" });
    }
});

app.get("/api/user/data.json", async (req, res) => {
    if (req.query.id == req.session.userId) {
        return res.json({ error: "Cannot display YOU" });
    }
    const idForDb = req.query.id == 0 ? req.session.userId : req.query.id;
    try {
        const result = await db.getUserById(idForDb);
        if (result.rowCount > 0) {
            return res.json({
                first: result.rows[0].first,
                last: result.rows[0].last,
                profilePicUrl: result.rows[0].profile_pic_url,
                bio: result.rows[0].bio,
            });
        } else {
            res.json({ error: "Unknown user" });
        }
    } catch (err) {
        res.json({ error: "Error in database" });
    }
});

app.get("/api/friends.json", async (req, res) => {
    // console.log("fetching friends for user:", req.session.userId);
    try {
        const { rows } = await db.getAllRelations(req.session.userId);
        res.json(rows);
    } catch (error) {
        console.log("error in fetching friends:", error);
        res.json({ error: "Error in Loading Friends" });
    }
});

app.post("/api/user/friendBtn.json", async (req, res) => {
    try {
        if (req.body.action == "") {
            const { rows } = await db.getFriendInfo(
                req.session.userId,
                req.body.friendId
            );
            // console.log("DB-Results", rows);
            if (rows.length == 0) {
                return res.json({ text: "Send Friend Request" });
            }
            if (rows[0].confirmed) {
                return res.json({ text: "Cancel Friendship" });
            }
            if (rows[0].sender == req.session.userId) {
                return res.json({ text: "Cancel Request" });
            }
            return res.json({ text: "Accept Request" });
        }

        if (req.body.action == "Send Friend Request") {
            const { rowCount } = await db.safeFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                return res.json({ text: "Cancel Request" });
            }
        }

        if (req.body.action == "Cancel Request") {
            const { rowCount } = await db.deleteFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                return res.json({ text: "Send Friend Request" });
            }
        }

        if (req.body.action == "Accept Request") {
            const { rowCount } = await db.confirmFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                return res.json({ text: "Cancel Friendship" });
            }
        }

        if (
            req.body.action == "Cancel Friendship" ||
            req.body.action == "Deny Request"
        ) {
            const { rowCount } = await db.deleteFriendship(
                req.session.userId,
                req.body.friendId
            );
            // console.log("DB from Cancel", rowCount);
            if (rowCount > 0) {
                return res.json({ text: "Send Friend Request" });
            }
        }

        return res.json({
            text: "Internal error - please try again later",
            error: true,
        });
    } catch (error) {
        return res.json({
            text: "Server error - please try again later",
            error: true,
        });
    }
});

app.get("/api/findUsers.json", async (req, res) => {
    const { search } = req.query;
    let result;
    try {
        if (search) {
            result = await db.getUserByTextSearch(search, req.session.userId);
            // console.log(result.first.rows);
            // console.log(result.last.rows);
            result.rows = [...result.first.rows, ...result.last.rows];
            result.rowCount = result.first.rowCount + result.last.rowCount;
        } else {
            result = await db.getMostRecentUsers(
                LIMIT_OF_RECENT_USERS,
                req.session.userId
            );
        }
        if (result.rowCount > 0) {
            res.json({
                search,
                result: result.rows,
            });
        } else {
            res.json({ error: "no users found" });
        }
    } catch (err) {
        res.json({ error: "Problem in DB" });
    }
});

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
            res.json({ error: "Upload failed" });
        }
    }
);

app.post("/api/profile-bio.json", async (req, res) => {
    try {
        const result = await db.addBio(req.body.bio, req.session.userId);
        if (result.rowCount > 0) {
            res.json({ update: "success" });
        } else {
            res.json({ error: "Could not write to DB" });
        }
    } catch (err) {
        res.json({ error: "DB rejected Bio" });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
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
