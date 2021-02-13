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
            } else {
                return { error: "Wrong Password" };
            }
        } else {
            return { error: "User not found" };
        }
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
            // console.log(result.rows[0].code);
            return result.rows[0].code == code;
        } else {
            return false;
        }
    } catch (err) {
        console.log("error in searching code in db:", err);
        return err;
    }
};
