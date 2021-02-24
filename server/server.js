const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const compression = require("compression");
const path = require("path");

let cookie_secret = process.env.cookie_secret
    ? process.env.cookie_secret
    : require("../secrets.json").secretOfSession;
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: cookie_secret,
    maxAge: 1000 * 60 * 60 * 24 * 7,
});

const csurf = require("csurf");
const {
    CODE_VALIDITY_IN_MINUTES,
    LIMIT_OF_RECENT_USERS,
} = require("../config.json");

const db = require("./db");
const auth = require("./auth");
const { sendEMail, uploader, uploadToAWS, deleteFromAWS } = require("./aws");
const { distributeNewChatMessage, activeUsers } = require("./socketHelpers");

const activeSockets = {};
let id;

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
        res.json({ status: "OK" });
    } catch (err) {
        if (err.code == "23505") {
            res.json({ error: "E-Mail already exists" });
        } else {
            res.json({ error: "Server error" });
        }
    }
});

app.post("/api/login.json", async (req, res) => {
    console.log("new receive:", req.body);
    try {
        const result = await db.getAuthenticatedUser(
            req.body.email,
            req.body.password
        );
        if (result.id) {
            req.session.userId = result.id;
            res.json({
                status: "OK",
            });
        } else {
            console.log(result);
            if (result.error == "Error in DB") {
                res.json({ error: "No Connection" });
            } else {
                res.json({ error: "Invalid user credentials" });
            }
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
    // console.log("receiving:", req.query);
    if (req.query.id == req.session.userId) {
        return res.json({ error: "Cannot display YOU" });
    }
    const idForDb = req.query.id == 0 ? req.session.userId : req.query.id;
    try {
        const result = await db.getUserById(idForDb);
        // console.log("checking:", result);
        if (result.rowCount > 0) {
            return res.json({
                first: result.rows[0].first,
                last: result.rows[0].last,
                profilePicUrl: result.rows[0].profile_pic_url,
                bio: result.rows[0].bio,
                total: result.rows[0].total,
                created_at: result.rows[0].created_at,
            });
        } else {
            res.json({ error: "User unkown - please log in again" });
        }
    } catch (err) {
        // console.log("checking2:", err);
        res.json({ error: "Failed Connection to Database" });
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
        if (req.body.task == "") {
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

        if (req.body.task == "Send Friend Request") {
            const { rowCount } = await db.safeFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                return res.json({ text: "Cancel Request" });
            }
        }

        if (req.body.task == "Cancel Request") {
            const { rowCount } = await db.deleteFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                return res.json({ text: "Send Friend Request" });
            }
        }

        if (req.body.task == "Accept Request") {
            const { rowCount } = await db.confirmFriendRequest(
                req.session.userId,
                req.body.friendId
            );
            if (rowCount > 0) {
                return res.json({ text: "Cancel Friendship" });
            }
        }

        if (
            req.body.task == "Cancel Friendship" ||
            req.body.task == "Deny Request"
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
            res.json({ empty: "no users found" });
        }
    } catch (err) {
        res.json({ error: "Problem in connecting to Database" });
    }
});

app.post(
    "/api/user/profile-pic.json",
    uploader.single("file"),
    async (req, res) => {
        try {
            const awsAdd = await uploadToAWS(req);
            const awsDelete = await deleteFromAWS(req.body.old);
            let sql;
            if (awsAdd.url && awsDelete.success) {
                sql = await db.addProfilePic(awsAdd.url, req.session.userId);
            }
            if (sql.rowCount > 0) {
                res.json(awsAdd);
            } else {
                res.json({ error: "DB rejected new picture" });
            }
        } catch (error) {
            res.json({ error: "Upload failed - try again later" });
        }
    }
);

app.post("/api/profile-bio.json", async (req, res) => {
    try {
        const result = await db.addBio(req.body.bio, req.session.userId);
        if (result.rowCount > 0) {
            res.json({ update: "success" });
        } else {
            res.json({ error: "Could not write to Database" });
        }
    } catch (err) {
        res.json({ error: "Failed Connection to Database" });
    }
});

app.get("/api/chat.json", async (req, res) => {
    // console.log("requested chat", req.query);
    id = req.session.userId;
    try {
        const { rows } = await db.getLastChats(req.session.userId, req.query.q);
        // console.log("sending Chats with id", req.query.q);
        res.json(rows);
    } catch (error) {
        console.log("error in loading chat:", error);
        res.json({ error: "Error in Loading Chat" });
    }
});

app.post("/api/deleteUser", async (req, res) => {
    // console.log("deleting the user with URL:", req.body.url);
    try {
        const awsDeletion = await deleteFromAWS(req.body.url);
        const sqlDeletion = await db.deleteAllUserData(req.session.userId);
        res.json({
            success: true,
            deletionResult: {
                awsDeletion,
                sqlDeletion,
            },
        });
    } catch (error) {
        console.log("error while deletion:", error);
        res.json({ success: false });
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

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", async (socket) => {
    // console.log(socket.request);
    activeSockets[socket.id] = socket.request.session.userId;
    // console.log("Change in Socket-Conenctions");
    // console.log(activeSockets);
    const users = await activeUsers(activeSockets);
    // console.log("active users for client:", users);
    io.emit("activeUsers", users);
    // activeUsers(activeSockets);

    socket.on("newMessage", async (msg) => {
        // console.log("message:", msg);
        let status;
        try {
            const result = await db.addNewMessage(
                socket.request.session.userId,
                msg.replyTo,
                msg.recipient,
                msg.value
            );
            status = {
                ...result.user.rows[0],
                ...result.chat.rows[0],
            };
        } catch (error) {
            status = { error: "Server Error" };
        }
        if (msg.recipient == 0) {
            // message to all
            status.public = true;
            status.private = false;
            io.emit("newMsg", status);
        } else if (msg.recipient == id) {
            // message to self
            status.public = false;
            status.private = true;
            socket.emit("newMsg", status);
        } else {
            // private PM
            status.public = false;
            status.private = true;
            socket.emit("newMsg", status);
            let recipientSocket = Object.entries(activeSockets);
            for (let i = 0; i < recipientSocket.length; i++) {
                if (recipientSocket[i][1] == msg.recipient) {
                    io.to(recipientSocket[i][0]).emit("newMsg", status);
                }
            }
        }
    });

    socket.on("disconnect", async () => {
        delete activeSockets[socket.id];
        io.emit("activeUsers", await activeUsers(activeSockets));
    });
});
