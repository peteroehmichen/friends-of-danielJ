const { hash, compare } = require("./authenticate");
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

module.exports.getAuthenticatedUser = function (email, password) {
    return this.getUserByEmail(email).then((result) => {
        // console.log("return from SQL:", result);
        let user;
        if (result.rowCount == 1) {
            user = result.rows[0];
            return compare(password, result.rows[0].password).then((result) => {
                // console.log("COMPARE:", result);
                if (result) {
                    return user;
                } else {
                    return { error: "Wrong Password" };
                }
            });
        } else {
            // eval result if email not found
            return { error: "User not found" };
        }
    });
};

module.exports.getUserByEmail = function getUserByEmail(email) {
    return sql.query(`SELECT * FROM users WHERE email=$1`, [email]);
};

module.exports.addResetCode = function (email, code) {
    return sql.query(`INSERT INTO codes (email, code) VALUES ($1, $2);`, [
        email,
        code,
    ]);
};

module.exports.updateUser = function (email, hashedPw) {
    return sql.query(`UPDATE users SET password = $1 WHERE email = $2;`, [
        hashedPw,
        email,
    ]);
};

module.exports.confirmCode = function (code, email) {
    return sql
        .query(
            `SELECT code FROM codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND email = $1 ORDER BY id DESC;`,
            [email]
        )
        .then((result) => {
            if (result.rowCount > 0) {
                return result.rows[0].code == code;
            } else {
                return false;
            }
        })
        .catch((err) => {
            console.log("error in searching code in db:", err);
        });
};
