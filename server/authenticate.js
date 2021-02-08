const bcrypt = require("bcryptjs");
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.compare = compare;

module.exports.hash = (plainPw) => {
    return genSalt()
        .then((salt) => hash(plainPw, salt))
        .catch((err) => console.log("Error in hasing Pw:", err));
};
