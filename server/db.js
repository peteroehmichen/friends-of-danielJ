const auth = require("./auth");
const spicedPg = require("spiced-pg");
const sql = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/adobo-socialnetwork"
);

module.exports.addUser = function (first, last, email, hashedPW) {
    // const params = [...arguments];
    // console.log("received", params);
    return sql.query(
        `INSERT INTO USERS (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id;`,
        [first, last, email, hashedPW]
    );
};

module.exports.addProfilePic = function (url, id) {
    return sql.query(`UPDATE users SET profile_pic_url = $1 WHERE id = $2;`, [
        url,
        id,
    ]);
};

module.exports.addBio = function (bio, id) {
    return sql.query(`UPDATE users SET bio = $1 WHERE id = $2;`, [bio, id]);
};

module.exports.getAuthenticatedUser = async function (email, password) {
    try {
        const result = await this.getUserByEmail(email);
        if (result.rowCount == 1) {
            const confirmPw = await auth.compare(
                password,
                result.rows[0].password
            );
            if (confirmPw) {
                return result.rows[0];
            }
            return { error: "Wrong Password" };
        }
        return { error: "User not found" };
    } catch (err) {
        return { error: "Error in DB" };
    }
};

module.exports.getUserByEmail = function getUserByEmail(email) {
    return sql.query(`SELECT * FROM users WHERE email=$1`, [email]);
};

module.exports.getUserById = function getUserByEmail(id) {
    return sql.query(`SELECT * FROM users WHERE id=$1`, [id]);
};

module.exports.getUserByTextSearch = async function (text, userId) {
    const tag = text.length > 1 ? `%${text}%` : `${text}%`;
    return {
        first: await sql.query(
            `SELECT id, first, last, profile_pic_url, bio FROM users WHERE first ILIKE $1 AND id!=$2;`,
            [tag, userId]
        ),
        last: await sql.query(
            `SELECT id, first, last, profile_pic_url, bio FROM users WHERE last ILIKE $1 AND id!=$2;`,
            [tag, userId]
        ),
    };
    //
};

module.exports.getMostRecentUsers = function (limit, userId) {
    return sql.query(
        `SELECT id, first, last, profile_pic_url, bio FROM users WHERE id!=$1 ORDER BY id DESC LIMIT $2;`,
        [userId, limit]
    );
};

module.exports.addResetCode = function (email, code) {
    return sql.query(
        `INSERT INTO codes (email, code) VALUES ($1, $2) RETURNING created_at;`,
        [email, code]
    );
};

module.exports.updateUser = function (email, hashedPw) {
    return sql.query(`UPDATE users SET password = $1 WHERE email = $2;`, [
        hashedPw,
        email,
    ]);
};

module.exports.confirmCode = async function (code, validity, email) {
    // console.log("looking for codes younger than:", validity);
    try {
        const result = await sql.query(
            `SELECT code FROM codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '${validity} minutes' AND email = $1 ORDER BY id DESC;`,
            [email]
        );
        if (result.rowCount > 0) {
            return result.rows[0].code == code;
        }
        return false;
    } catch (err) {
        return err;
    }
};

module.exports.safeFriendRequest = function (userId, friendId) {
    return sql.query(
        `INSERT INTO friendships (sender, recipient) VALUES ($1, $2);`,
        [userId, friendId]
    );
};

module.exports.confirmFriendRequest = function (userId, friendId) {
    return sql.query(
        `UPDATE friendships SET confirmed=true WHERE (sender=$1 AND recipient=$2);`,
        [friendId, userId]
    );
};

module.exports.deleteFriendRequest = function (userId, friendId) {
    return sql.query(
        `DELETE FROM friendships WHERE (sender=$1 AND recipient=$2);`,
        [userId, friendId]
    );
};

module.exports.deleteFriendship = function (userId, friendId) {
    return sql.query(
        `DELETE FROM friendships WHERE (sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1);`,
        [userId, friendId]
    );
};

module.exports.getFriendInfo = function (userId, friendId) {
    return sql.query(
        `SELECT * FROM friendships WHERE (sender=$1 AND recipient=$2) OR (sender=$2 AND recipient=$1);`,
        [userId, friendId]
    );
};
